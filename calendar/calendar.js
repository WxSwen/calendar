const moment = require('../../utils/moment');
let app = getApp();

Page({
  data: {
    calendar_today: moment.formatDayToMMDD(new Date().toString()),
    //日历的使用数据
    calendar_day: ['日', '一', '二', '三', '四', '五', '六'],
    calendar_desc: ['入住', '离店'],
    calendar_bookTime_desc: [
      { arrange: `${moment.getDayFromNow(0)},${moment.getDayFromNow(1)}`, desc: '明天入住'}, 
      { arrange: `${moment.getDayFromNow(1)},${moment.getDayFromNow(2)}`,desc: '后天入住'}
    ],
    calendar_setMonthArray: [new Date(), moment.getMonthFromNow(1,new Date()), moment.getMonthFromNow(2,new Date())],
    calendar_calendar: [],
  },
  onLoad() {
    let calendar_calendar = [];
    //循环获取日历（根据 calendar_setMonthArray数据获取所需的日期）
    //默认数组第一个时间为现在的月份
    this.data.calendar_setMonthArray.map((day, index) => {
      calendar_calendar.push(this.getMonthCalendar(day, index === 0));
    });
    //一次性setdata
    this.setData({
      calendar_calendar
    })
  },
  onShow() {
    //初始默认数据
    this.setData({
      //展示时间
      calendar_startDate: moment.formatDayToMMDD(app.search.checkInDate),
      calendar_endDate: moment.formatDayToMMDD(app.search.checkOutDate),
      calendar_startDesc: moment.getWeeklyDay(app.search.checkInDate),
      calendar_endDesc: moment.getWeeklyDay(app.search.checkOutDate),
      //起始-终止时间
      calendar_setStart: app.search.checkInDate.replace(/\//g,''),
      calendar_setEnd: app.search.checkOutDate.replace(/\//g,'')
    })
  },
  getMonthCalendar(date, firstMonth) {
    /**
     * @param data: string,日期
     * @param firstMonth: boolean,判断已过日期
     * @description 生成带有time的对比数据日历 time: 20171112
     */ 
    let dates = new Date(date);
    let today = dates.getDate();
    let month = dates.getMonth() + 1;
    let year = dates.getFullYear();
    let firstDay = moment.getMonthFirstDay(date);
    let lastDay = moment.getMonthLastDay(firstDay);
    let beginDay = firstDay.getDay();
    //总循环次数（终止时间-起始时间+在一个星期中的位置）
    let space = moment.getDaySpace(firstDay, lastDay) + beginDay; 
    
    let calendar_day = [];
    let calendar = {};
    for(let i = 0; i <= space; i++ ){
      let day = i - beginDay + 1;
      let pass = firstMonth && (today > day);
      let time = `${year}${month >= 10 ? month : '0'+month}${day >= 10 ? day : '0'+day}`;
      calendar_day.push(
        i < beginDay 
        ? {} 
        : {
          day,
          pass,
          time,
        })
    }
    calendar.month = month;
    calendar.day = calendar_day;
    return calendar;
  },
  //点击日历选择时间段
  selectTimeRange(e) {
    const {time, pass} = e.currentTarget.dataset;
    let calendar_setStart = this.data.calendar_setStart;
    let calendar_setEnd = this.data.calendar_setEnd;
    if(pass || pass === undefined) return;
    if(calendar_setStart && calendar_setEnd){
      this.setData({
        calendar_startDate: moment.formatDayToMMDD(this.getDateTime(time)),
        calendar_startDesc: moment.getWeeklyDay(this.getDateTime(time)),
        calendar_setStart: time,
        calendar_setEnd: null,
      })
    } else {
      this.setData(time < calendar_setStart 
        ? {
          calendar_startDate: moment.formatDayToMMDD(this.getDateTime(time)),
          calendar_startDesc: moment.getWeeklyDay(this.getDateTime(time)),
          calendar_setStart: time,
          calendar_setEnd: null,
        }:{
          calendar_endDate: moment.formatDayToMMDD(this.getDateTime(time)),
          calendar_endDesc: moment.getWeeklyDay(this.getDateTime(time)),
          calendar_setEnd: time,
        })  
    }
  },
  //点击预订好的时间按钮
  setBookTime(e){
    let { arrange } = e.currentTarget.dataset;
    arrange = arrange.replace(/\//g,'');
    let timeArray = arrange.split(',');
    this.setData({
      calendar_startDate: moment.formatDayToMMDD(this.getDateTime(timeArray[0])),
      calendar_endDate: moment.formatDayToMMDD(this.getDateTime(timeArray[1])),
      calendar_startDesc: moment.getWeeklyDay(this.getDateTime(timeArray[0])),
      calendar_endDesc: moment.getWeeklyDay(this.getDateTime(timeArray[1])),
      calendar_setStart: timeArray[0],
      calendar_setEnd: timeArray[1],
    });
  },
  //点击确认返回
  submitTime() {
    if(!this.data.calendar_setStart || !this.data.calendar_setEnd) return;
    app.search.checkInDate = this.getDateTime(this.data.calendar_setStart);
    app.search.checkOutDate = this.getDateTime(this.data.calendar_setEnd);
    wx.navigateBack({
      delta: 1
    })
  },
  //时间格式化
  getDateTime(time) {
    return time.replace(/(\d{4})(\d{2})(\d{2})/,"$1/$2/$3");
  },
})
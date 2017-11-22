/* 常用时间函数 */
/* 使用类，不易与其他名称混合，并且有提示该函数是时间函数作用 */
/* import moment from 'moment' */
/* moment.isValid() */

class Moment {
  constructor() {
  }
  /* 不足10，添加0 */
  static zeroize(num) {
    return parseInt(num) < 10 ? `0${num}` : num;
  }
  /* 检查日期合法性 */
  static isValid(day) {
    return new Date(day).getTime().toString() !== 'Invalid Date';
  }
  /* 将时间格式化成(xx/xx/xx) */
  static localDay(dayTime) {
    var dateTime = new Date(dayTime);
    return `${dateTime.getFullYear()}/${this.zeroize(dateTime.getMonth() + 1)}/${this.zeroize(dateTime.getDate())}`
  }
  /* 获取距离今天多少天是什么日期 */
  static getDayFromNow(num, date) {
    let oneDay = 86400000;
    let today = date ? new Date(date).getTime() : new Date().getTime();
    return this.localDay(today + (num ? oneDay * num : 0));
  }
  /* 获取天数间隔 */
  static getDaySpace(startDay, endDay) {
    let oneDay = 86400000;
    startDay = startDay.toString().replace(/\d{2}:\d{2}:\d{2}/,'00:00:00');
    endDay = endDay.toString().replace(/\d{2}:\d{2}:\d{2}/,'00:00:00');
    return parseInt((new Date(endDay).getTime() - new Date(startDay).getTime()) / oneDay) ;
  }
  static isToday(date) {
    return this.getDayFromNow(0).replace(/\//g,'-') === date;
  }
  static getWeeklyDay(date) {
    let weekArr = ['日', '一', '二', '三', '四', '五', '六'];
    return `周${weekArr[new Date(date).getDay()]}`;
  }
  /* 将 yyyy/MM/dd 格式化成 yyyy-MM-dd */
  static formatDay(date) {
    return date.replace(/\//g, '-');
  }
  /* 格式化 Date 对象到相应格式 */ 
  static formatDayTo(date, fmt) {
    var o = {
      "M+": date.getMonth() + 1, //月份 
      "d+": date.getDate(), //日 
      "h+": date.getHours(), //小时 
      "m+": date.getMinutes(), //分 
      "s+": date.getSeconds(), //秒 
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
      "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
  }
  static formatDayToMMDD(dateStr) {
    return this.formatDayTo(new Date(dateStr.replace(/-/g, '/')), "MM/dd");
  }


  // 获取当月起始时间
  static getMonthFirstDay(day) {
    let date = new Date(day);
    date.setDate(1);
    return new Date(date);
  }
  // 获取当月结束时间
  static getMonthLastDay(day) {
    let nextMonthFirstDay = this.getMonthFromNow(1, day);
    let oneDay = 1000*60*60*24;
    return new Date(nextMonthFirstDay - oneDay);
  }
  /* 获取距离今天第几个月是哪个月 */
  static getMonthFromNow(num, day) {
    let date = new Date(day);
    let currentMonth = date.getMonth();
    return new Date(date.getFullYear(),currentMonth + num,1);
  }
}

module.exports = Moment;

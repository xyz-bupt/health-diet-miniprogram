/**
 * format.js - 日期与数字格式化工具
 */

/**
 * 格式化时间
 * @param {Date|number|string} date - 时间对象或时间戳
 * @param {string} format - 格式化模板
 * @returns {string} 格式化后的时间字符串
 */
export function formatTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  const second = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second);
}

/**
 * 获取今天的日期字符串
 * @returns {string} YYYY-MM-DD格式
 */
export function getTodayDate() {
  return formatTime(new Date(), 'YYYY-MM-DD');
}

/**
 * 计算两个日期之间的天数差
 * @param {string|Date} date1 - 日期1
 * @param {string|Date} date2 - 日期2
 * @returns {number} 天数差
 */
export function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = d1.getTime() - d2.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

/**
 * 数字格式化
 * @param {number} num - 数字
 * @param {number} decimals - 小数位数
 * @returns {string} 格式化后的字符串
 */
export function formatNumber(num, decimals = 2) {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }

  return Number(num).toFixed(decimals);
}

/**
 * 千分位分隔
 * @param {number} num - 数字
 * @returns {string} 格式化后的字符串
 */
export function formatThousands(num) {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }

  return Number(num).toLocaleString('zh-CN');
}

/**
 * 百分比格式化
 * @param {number} value - 数值
 * @param {number} total - 总数
 * @param {number} decimals - 小数位数
 * @returns {string} 百分比字符串
 */
export function formatPercent(value, total, decimals = 1) {
  if (!total || total === 0) {
    return '0%';
  }

  const percent = (value / total) * 100;
  return `${formatNumber(percent, decimals)}%`;
}

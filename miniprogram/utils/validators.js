/**
 * validators.js - 数据验证工具
 */

/**
 * 验证手机号
 * @param {string} phone - 手机号
 * @returns {boolean} 是否有效
 */
export function validatePhone(phone) {
  const regex = /^1[3-9]\d{9}$/;
  return regex.test(phone);
}

/**
 * 验证邮箱
 * @param {string} email - 邮箱
 * @returns {boolean} 是否有效
 */
export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

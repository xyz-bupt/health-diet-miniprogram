/**
 * util.js - 通用工具函数（桶导出文件）
 *
 * 此文件作为统一入口，从各子模块重新导出所有工具函数。
 * 各子模块按职责拆分：
 *   - format.js    : 日期与数字格式化
 *   - helpers.js   : 防抖、节流、对象操作、URL 工具
 *   - array.js     : 数组操作（去重、排序、统计等）
 *   - validators.js: 数据验证
 *   - wx-api.js    : 微信 API 封装（提示、导航）
 */

// 日期与数字格式化
export {
  formatTime,
  getTodayDate,
  daysBetween,
  formatNumber,
  formatThousands,
  formatPercent
} from './format.js';

// 通用辅助工具
export {
  debounce,
  throttle,
  deepClone,
  merge,
  generateId,
  clamp,
  lerp,
  isEmpty,
  parseUrlParams,
  stringifyUrlParams
} from './helpers.js';

// 数组操作
export {
  unique,
  sortBy,
  groupBy,
  getRandom,
  sum,
  average,
  max,
  min
} from './array.js';

// 数据验证
export {
  validatePhone,
  validateEmail
} from './validators.js';

// 微信 API 封装
export {
  copyToClipboard,
  showToast,
  showLoading,
  hideLoading,
  showConfirm,
  navigateTo,
  redirectTo,
  switchTab,
  navigateBack
} from './wx-api.js';

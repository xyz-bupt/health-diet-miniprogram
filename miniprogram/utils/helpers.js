/**
 * helpers.js - 通用辅助工具（防抖、节流、对象操作、URL等）
 *
 * 修复说明：
 * - 转换为 CommonJS 格式以兼容微信小程序
 * - 使用 module.exports
 */

/**
 * 防抖函数
 * @param {Function} fn - 要执行的函数
 * @param {number} delay - 延迟时间 (ms)
 * @returns {Function} 防抖后的函数
 */
function debounce(fn, delay = 300) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 节流函数
 * @param {Function} fn - 要执行的函数
 * @param {number} delay - 延迟时间 (ms)
 * @returns {Function} 节流后的函数
 */
function throttle(fn, delay = 300) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

/**
 * 深拷贝对象
 * @param {any} obj - 要拷贝的对象
 * @returns {any} 拷贝后的对象
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }

  const clonedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  return clonedObj;
}

/**
 * 合并对象
 * @param {object} target - 目标对象
 * @param {object} source - 源对象
 * @returns {object} 合并后的对象
 */
function merge(target, source) {
  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = merge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }

  return result;
}

/**
 * 随机生成ID
 * @param {number} length - ID长度
 * @returns {string} 随机ID
 */
function generateId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

/**
 * 限制数值范围
 * @param {number} value - 数值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 限制后的数值
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * 线性插值
 * @param {number} start - 起始值
 * @param {number} end - 结束值
 * @param {number} t - 插值系数 (0-1)
 * @returns {number} 插值结果
 */
function lerp(start, end, t) {
  return start + (end - start) * t;
}

/**
 * 判断是否为空
 * @param {any} value - 值
 * @returns {boolean} 是否为空
 */
function isEmpty(value) {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  return false;
}

/**
 * URL参数解析
 * @param {string} url - URL字符串
 * @returns {object} 参数对象
 */
function parseUrlParams(url) {
  const params = {};
  const queryString = url.split('?')[1];

  if (queryString) {
    queryString.split('&').forEach(item => {
      const [key, value] = item.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
  }

  return params;
}

/**
 * 对象转URL参数
 * @param {object} params - 参数对象
 * @returns {string} URL参数字符串
 */
function stringifyUrlParams(params) {
  return Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key] || '')}`)
    .join('&');
}

// CommonJS 导出
module.exports = {
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
};

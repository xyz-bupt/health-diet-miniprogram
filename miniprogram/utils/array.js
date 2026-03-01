/**
 * array.js - 数组操作工具函数
 */

/**
 * 数组去重
 * @param {array} arr - 数组
 * @param {string} key - 对象数组的去重键
 * @returns {array} 去重后的数组
 */
export function unique(arr, key) {
  if (!Array.isArray(arr)) return [];

  if (key) {
    const seen = new Set();
    return arr.filter(item => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }

  return [...new Set(arr)];
}

/**
 * 数组排序
 * @param {array} arr - 数组
 * @param {string} key - 排序键
 * @param {string} order - 排序方向 (asc/desc)
 * @returns {array} 排序后的数组
 */
export function sortBy(arr, key, order = 'asc') {
  if (!Array.isArray(arr)) return [];

  return arr.slice().sort((a, b) => {
    const valueA = key ? a[key] : a;
    const valueB = key ? b[key] : b;

    if (valueA < valueB) {
      return order === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });
}

/**
 * 数组分组
 * @param {array} arr - 数组
 * @param {string} key - 分组键
 * @returns {object} 分组后的对象
 */
export function groupBy(arr, key) {
  if (!Array.isArray(arr)) return {};

  return arr.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
}

/**
 * 获取数组随机元素
 * @param {array} arr - 数组
 * @param {number} count - 数量
 * @returns {array} 随机元素数组
 */
export function getRandom(arr, count = 1) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return [];
  }

  const result = [];
  const copy = arr.slice();

  for (let i = 0; i < count && copy.length > 0; i++) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy[index]);
    copy.splice(index, 1);
  }

  return count === 1 ? result[0] : result;
}

/**
 * 数组求和
 * @param {array} arr - 数组
 * @param {string} key - 对象数组的求和键
 * @returns {number} 总和
 */
export function sum(arr, key) {
  if (!Array.isArray(arr)) return 0;

  return arr.reduce((total, item) => {
    const value = key ? item[key] : item;
    return total + (Number(value) || 0);
  }, 0);
}

/**
 * 数组求平均值
 * @param {array} arr - 数组
 * @param {string} key - 对象数组的求值键
 * @returns {number} 平均值
 */
export function average(arr, key) {
  if (!Array.isArray(arr) || arr.length === 0) return 0;

  const total = sum(arr, key);
  return total / arr.length;
}

/**
 * 数组求最大值
 * @param {array} arr - 数组
 * @param {string} key - 对象数组的比较键
 * @returns {number} 最大值
 */
export function max(arr, key) {
  if (!Array.isArray(arr) || arr.length === 0) return 0;

  let maxValue = key ? arr[0][key] : arr[0];

  for (let i = 1; i < arr.length; i++) {
    const value = key ? arr[i][key] : arr[i];
    if (value > maxValue) {
      maxValue = value;
    }
  }

  return maxValue;
}

/**
 * 数组求最小值
 * @param {array} arr - 数组
 * @param {string} key - 对象数组的比较键
 * @returns {number} 最小值
 */
export function min(arr, key) {
  if (!Array.isArray(arr) || arr.length === 0) return 0;

  let minValue = key ? arr[0][key] : arr[0];

  for (let i = 1; i < arr.length; i++) {
    const value = key ? arr[i][key] : arr[i];
    if (value < minValue) {
      minValue = value;
    }
  }

  return minValue;
}

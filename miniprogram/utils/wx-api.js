/**
 * wx-api.js - 微信API封装（提示、导航等）
 *
 * 修复说明：
 * - 转换为 CommonJS 格式以兼容微信小程序
 * - 使用 module.exports
 */

const { stringifyUrlParams } = require('./helpers.js');

/**
 * 复制到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise} 复制结果
 */
function copyToClipboard(text) {
  return new Promise((resolve, reject) => {
    wx.setClipboardData({
      data: String(text),
      success: () => resolve(),
      fail: reject
    });
  });
}

/**
 * 显示提示消息
 * @param {string} title - 提示内容
 * @param {string} icon - 图标类型
 * @param {number} duration - 持续时间
 */
function showToast(title, icon = 'none', duration = 2000) {
  wx.showToast({
    title: title,
    icon: icon,
    duration: duration
  });
}

/**
 * 显示加载提示
 * @param {string} title - 提示内容
 */
function showLoading(title = '加载中...') {
  wx.showLoading({
    title: title,
    mask: true
  });
}

/**
 * 隐藏加载提示
 */
function hideLoading() {
  wx.hideLoading();
}

/**
 * 显示确认对话框
 * @param {string} content - 内容
 * @param {string} title - 标题
 * @returns {Promise} 用户选择结果
 */
function showConfirm(content, title = '提示') {
  return new Promise((resolve) => {
    wx.showModal({
      title: title,
      content: content,
      success: (res) => {
        resolve(res.confirm);
      },
      fail: () => resolve(false)
    });
  });
}

/**
 * 页面跳转
 * @param {string} url - 页面路径
 * @param {object} params - 参数对象
 */
function navigateTo(url, params = {}) {
  let queryString = '';
  if (Object.keys(params).length > 0) {
    queryString = '?' + stringifyUrlParams(params);
  }

  wx.navigateTo({
    url: url + queryString,
    fail: () => {
      showToast('页面跳转失败');
    }
  });
}

/**
 * 页面重定向
 * @param {string} url - 页面路径
 * @param {object} params - 参数对象
 */
function redirectTo(url, params = {}) {
  let queryString = '';
  if (Object.keys(params).length > 0) {
    queryString = '?' + stringifyUrlParams(params);
  }

  wx.redirectTo({
    url: url + queryString,
    fail: () => {
      showToast('页面跳转失败');
    }
  });
}

/**
 * 切换Tab页面
 * @param {string} url - 页面路径
 */
function switchTab(url) {
  wx.switchTab({
    url: url,
    fail: () => {
      showToast('页面切换失败');
    }
  });
}

/**
 * 返回上一页
 * @param {number} delta - 返回层数
 */
function navigateBack(delta = 1) {
  wx.navigateBack({
    delta: delta,
    fail: () => {
      showToast('返回失败');
    }
  });
}

// CommonJS 导出
module.exports = {
  copyToClipboard,
  showToast,
  showLoading,
  hideLoading,
  showConfirm,
  navigateTo,
  redirectTo,
  switchTab,
  navigateBack
};

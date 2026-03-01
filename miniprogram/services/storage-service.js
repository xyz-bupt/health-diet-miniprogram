/**
 * storage-service.js - 本地存储服务
 * 封装微信小程序本地存储API，提供便捷的数据存取方法
 */

import { STORAGE_KEYS } from '../utils/constants.js';

/**
 * 存储服务类
 */
class StorageService {
  constructor() {
    this.storageKeys = STORAGE_KEYS;
  }

  /**
   * 设置数据
   * @param {string} key - 键名
   * @param {any} value - 值
   * @param {boolean} sync - 是否同步
   * @returns {Promise}
   */
  set(key, value, sync = false) {
    const data = JSON.stringify(value);

    if (sync) {
      try {
        wx.setStorageSync(key, data);
        return Promise.resolve(true);
      } catch (error) {
        console.error('同步存储失败:', error);
        return Promise.reject(error);
      }
    }

    return new Promise((resolve, reject) => {
      wx.setStorage({
        key: key,
        data: data,
        success: () => resolve(true),
        fail: (error) => {
          console.error('存储失败:', error);
          reject(error);
        }
      });
    });
  }

  /**
   * 获取数据
   * @param {string} key - 键名
   * @param {any} defaultValue - 默认值
   * @param {boolean} sync - 是否同步
   * @returns {Promise<any>}
   */
  get(key, defaultValue = null, sync = false) {
    if (sync) {
      try {
        const value = wx.getStorageSync(key);
        return value ? Promise.resolve(JSON.parse(value)) : Promise.resolve(defaultValue);
      } catch (error) {
        console.error('同步获取失败:', error);
        return Promise.resolve(defaultValue);
      }
    }

    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: key,
        success: (res) => {
          try {
            resolve(JSON.parse(res.data));
          } catch (error) {
            resolve(defaultValue);
          }
        },
        fail: () => resolve(defaultValue)
      });
    });
  }

  /**
   * 删除数据
   * @param {string} key - 键名
   * @param {boolean} sync - 是否同步
   * @returns {Promise}
   */
  remove(key, sync = false) {
    if (sync) {
      try {
        wx.removeStorageSync(key);
        return Promise.resolve(true);
      } catch (error) {
        console.error('同步删除失败:', error);
        return Promise.reject(error);
      }
    }

    return new Promise((resolve, reject) => {
      wx.removeStorage({
        key: key,
        success: () => resolve(true),
        fail: (error) => {
          console.error('删除失败:', error);
          reject(error);
        }
      });
    });
  }

  /**
   * 清空所有数据
   * @param {boolean} sync - 是否同步
   * @returns {Promise}
   */
  clear(sync = false) {
    if (sync) {
      try {
        wx.clearStorageSync();
        return Promise.resolve(true);
      } catch (error) {
        console.error('同步清空失败:', error);
        return Promise.reject(error);
      }
    }

    return new Promise((resolve, reject) => {
      wx.clearStorage({
        success: () => resolve(true),
        fail: (error) => {
          console.error('清空失败:', error);
          reject(error);
        }
      });
    });
  }

  /**
   * 获取存储信息
   * @returns {Promise}
   */
  getInfo() {
    return new Promise((resolve, reject) => {
      wx.getStorageInfo({
        success: (res) => resolve(res),
        fail: (error) => reject(error)
      });
    });
  }

  // ==================== 用户相关 ====================

  /**
   * 保存用户信息
   * @param {object} userInfo - 用户信息
   * @returns {Promise}
   */
  setUserInfo(userInfo) {
    return this.set(this.storageKeys.USER_INFO, userInfo);
  }

  /**
   * 获取用户信息
   * @returns {Promise<object>}
   */
  getUserInfo() {
    return this.get(this.storageKeys.USER_INFO, null);
  }

  /**
   * 保存用户档案
   * @param {object} profile - 用户档案
   * @returns {Promise}
   */
  setUserProfile(profile) {
    return this.set(this.storageKeys.USER_PROFILE, profile);
  }

  /**
   * 获取用户档案
   * @returns {Promise<object>}
   */
  getUserProfile() {
    return this.get(this.storageKeys.USER_PROFILE, null);
  }

  /**
   * 同步获取用户档案
   * @returns {object}
   */
  getUserProfileSync() {
    try {
      const value = wx.getStorageSync(this.storageKeys.USER_PROFILE);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('同步获取用户档案失败:', error);
      return null;
    }
  }

  // ==================== 营养记录相关 ====================

  /**
   * 保存今日营养数据
   * @param {object} nutrition - 营养数据
   * @returns {Promise}
   */
  setTodayNutrition(nutrition) {
    return this.set(this.storageKeys.TODAY_NUTRITION, nutrition);
  }

  /**
   * 获取今日营养数据
   * @returns {Promise<object>}
   */
  getTodayNutrition() {
    return this.get(this.storageKeys.TODAY_NUTRITION, null);
  }

  /**
   * 同步获取今日营养数据
   * @returns {object}
   */
  getTodayNutritionSync() {
    try {
      const value = wx.getStorageSync(this.storageKeys.TODAY_NUTRITION);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('同步获取今日营养数据失败:', error);
      return null;
    }
  }

  /**
   * 保存食物记录
   * @param {array} records - 食物记录数组
   * @returns {Promise}
   */
  setFoodRecords(records) {
    return this.set(this.storageKeys.FOOD_RECORDS, records);
  }

  /**
   * 获取食物记录
   * @returns {Promise<array>}
   */
  getFoodRecords() {
    return this.get(this.storageKeys.FOOD_RECORDS, []);
  }

  /**
   * 添加食物记录
   * @param {object} record - 食物记录
   * @returns {Promise}
   */
  async addFoodRecord(record) {
    const records = await this.getFoodRecords();
    records.push({
      ...record,
      id: record.id || Date.now(),
      createTime: record.createTime || new Date().getTime()
    });
    return this.setFoodRecords(records);
  }

  /**
   * 删除食物记录
   * @param {number} recordId - 记录ID
   * @returns {Promise}
   */
  async removeFoodRecord(recordId) {
    const records = await this.getFoodRecords();
    const filteredRecords = records.filter(r => r.id !== recordId);
    return this.setFoodRecords(filteredRecords);
  }

  /**
   * 保存餐食历史
   * @param {object} history - 餐食历史
   * @returns {Promise}
   */
  setMealHistory(history) {
    return this.set(this.storageKeys.MEAL_HISTORY, history);
  }

  /**
   * 获取餐食历史
   * @returns {Promise<object>}
   */
  getMealHistory() {
    return this.get(this.storageKeys.MEAL_HISTORY, {});
  }

  /**
   * 添加餐食历史记录
   * @param {string} date - 日期
   * @param {string} mealType - 餐型
   * @param {object} mealData - 餐食数据
   * @returns {Promise}
   */
  async addMealHistory(date, mealType, mealData) {
    const history = await this.getMealHistory();

    if (!history[date]) {
      history[date] = {};
    }

    history[date][mealType] = {
      ...mealData,
      updateTime: new Date().getTime()
    };

    return this.setMealHistory(history);
  }

  /**
   * 获取指定日期的餐食历史
   * @param {string} date - 日期
   * @returns {Promise<object>}
   */
  async getMealHistoryByDate(date) {
    const history = await this.getMealHistory();
    return history[date] || {};
  }

  // ==================== 设置相关 ====================

  /**
   * 保存设置
   * @param {object} settings - 设置数据
   * @returns {Promise}
   */
  setSettings(settings) {
    return this.set(this.storageKeys.SETTINGS, settings);
  }

  /**
   * 获取设置
   * @returns {Promise<object>}
   */
  getSettings() {
    return this.get(this.storageKeys.SETTINGS, {});
  }

  /**
   * 更新设置
   * @param {object} updates - 要更新的设置
   * @returns {Promise}
   */
  async updateSettings(updates) {
    const settings = await this.getSettings();
    const newSettings = { ...settings, ...updates };
    return this.setSettings(newSettings);
  }

  /**
   * 检查是否首次启动
   * @returns {Promise<boolean>}
   */
  isFirstLaunch() {
    return this.get(this.storageKeys.FIRST_LAUNCH, true)
      .then(isFirst => {
        if (isFirst) {
          // 标记为已启动
          this.set(this.storageKeys.FIRST_LAUNCH, false);
          return true;
        }
        return false;
      });
  }

  // ==================== 数据统计相关 ====================

  /**
   * 获取存储使用情况
   * @returns {Promise<object>}
   */
  async getStorageStats() {
    try {
      const info = await this.getInfo();
      return {
        currentSize: info.currentSize,
        limitSize: info.limitSize,
        usagePercent: Math.round((info.currentSize / info.limitSize) * 100),
        keysLength: info.keys.length
      };
    } catch (error) {
      console.error('获取存储信息失败:', error);
      return {
        currentSize: 0,
        limitSize: 10240,
        usagePercent: 0,
        keysLength: 0
      };
    }
  }

  /**
   * 清理过期数据
   * @param {number} days - 保留天数
   * @returns {Promise}
   */
  async cleanOldData(days = 30) {
    try {
      const history = await this.getMealHistory();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const newHistory = {};
      for (const date in history) {
        const recordDate = new Date(date);
        if (recordDate >= cutoffDate) {
          newHistory[date] = history[date];
        }
      }

      await this.setMealHistory(newHistory);
      return true;
    } catch (error) {
      console.error('清理过期数据失败:', error);
      return false;
    }
  }

  /**
   * 导出所有数据
   * @returns {Promise<object>}
   */
  async exportData() {
    try {
      const [userInfo, userProfile, todayNutrition, foodRecords, mealHistory, settings] = await Promise.all([
        this.getUserInfo(),
        this.getUserProfile(),
        this.getTodayNutrition(),
        this.getFoodRecords(),
        this.getMealHistory(),
        this.getSettings()
      ]);

      return {
        exportTime: new Date().toISOString(),
        userInfo,
        userProfile,
        todayNutrition,
        foodRecords,
        mealHistory,
        settings
      };
    } catch (error) {
      console.error('导出数据失败:', error);
      return null;
    }
  }

  /**
   * 导入数据
   * @param {object} data - 导入的数据
   * @returns {Promise<boolean>}
   */
  async importData(data) {
    try {
      if (!data || typeof data !== 'object') {
        throw new Error('无效的数据格式');
      }

      const promises = [];

      if (data.userInfo) {
        promises.push(this.setUserInfo(data.userInfo));
      }
      if (data.userProfile) {
        promises.push(this.setUserProfile(data.userProfile));
      }
      if (data.todayNutrition) {
        promises.push(this.setTodayNutrition(data.todayNutrition));
      }
      if (data.foodRecords) {
        promises.push(this.setFoodRecords(data.foodRecords));
      }
      if (data.mealHistory) {
        promises.push(this.setMealHistory(data.mealHistory));
      }
      if (data.settings) {
        promises.push(this.setSettings(data.settings));
      }

      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('导入数据失败:', error);
      return false;
    }
  }
}

// 导出单例
export default new StorageService();

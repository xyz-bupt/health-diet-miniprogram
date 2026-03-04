/**
 * ai-service.js - AI食谱服务
 * 封装AI食谱生成相关的业务逻辑
 */

const aiClient = require('../utils/ai-client.js');

/**
 * AI食谱服务类
 */
class AIService {
  constructor() {
    this.client = aiClient;
    this.storageKey = 'ai_generated_recipes';
    this.configKey = 'ai_config';
  }

  /**
   * 加载保存的AI配置
   * @returns {object}
   */
  loadConfig() {
    try {
      const config = wx.getStorageSync(this.configKey);
      if (config) {
        this.client.setConfig(config);
        return config;
      }
    } catch (error) {
      console.error('加载AI配置失败:', error);
    }
    return null;
  }

  /**
   * 保存AI配置
   * @param {object} config
   * @returns {boolean}
   */
  saveConfig(config) {
    try {
      this.client.setConfig(config);
      wx.setStorageSync(this.configKey, config);
      return true;
    } catch (error) {
      console.error('保存AI配置失败:', error);
      return false;
    }
  }

  /**
   * 获取当前配置
   * @returns {object}
   */
  getConfig() {
    return this.client.getConfig();
  }

  /**
   * 获取提供商列表
   * @returns {array}
   */
  getProviders() {
    return this.client.getProviders();
  }

  /**
   * 检查是否已配置API
   * @returns {boolean}
   */
  isConfigured() {
    const config = this.client.getConfig();
    return !!(config && config.apiKey);
  }

  /**
   * 生成一日食谱
   * @param {object} userProfile - 用户档案
   * @returns {Promise<object>}
   */
  async generateDailyPlan(userProfile) {
    const result = await this.client.generateMealPlan(userProfile, 1);
    return result;
  }

  /**
   * 生成一周食谱
   * @param {object} userProfile - 用户档案
   * @returns {Promise<object>}
   */
  async generateWeeklyPlan(userProfile) {
    const result = await this.client.generateMealPlan(userProfile, 7);
    return result;
  }

  /**
   * 保存生成的食谱
   * @param {object} plan - 生成的食谱计划
   * @param {string} type - daily/weekly
   * @returns {boolean}
   */
  saveGeneratedPlan(plan, type = 'daily') {
    try {
      const history = this.getGeneratedHistory();
      const newPlan = {
        id: this.generateId(),
        type: type,
        data: plan,
        createdAt: new Date().getTime(),
        date: new Date().toISOString().split('T')[0]
      };

      history.unshift(newPlan);

      // 只保留最近10条
      if (history.length > 10) {
        history.pop();
      }

      wx.setStorageSync(this.storageKey, history);
      return true;
    } catch (error) {
      console.error('保存生成食谱失败:', error);
      return false;
    }
  }

  /**
   * 获取生成历史
   * @returns {array}
   */
  getGeneratedHistory() {
    try {
      return wx.getStorageSync(this.storageKey) || [];
    } catch (error) {
      return [];
    }
  }

  /**
   * 根据ID获取生成的食谱
   * @param {string} id
   * @returns {object|null}
   */
  getGeneratedById(id) {
    const history = this.getGeneratedHistory();
    return history.find(item => item.id === id) || null;
  }

  /**
   * 删除生成的食谱
   * @param {string} id
   * @returns {boolean}
   */
  deleteGeneratedPlan(id) {
    try {
      let history = this.getGeneratedHistory();
      history = history.filter(item => item.id !== id);
      wx.setStorageSync(this.storageKey, history);
      return true;
    } catch (error) {
      console.error('删除生成食谱失败:', error);
      return false;
    }
  }

  /**
   * 清空生成历史
   * @returns {boolean}
   */
  clearHistory() {
    try {
      wx.removeStorageSync(this.storageKey);
      return true;
    } catch (error) {
      console.error('清空历史失败:', error);
      return false;
    }
  }

  /**
   * 测试API连接
   * @returns {Promise<object>}
   */
  async testConnection() {
    return await this.client.testConnection();
  }

  /**
   * 生成唯一ID
   * @returns {string}
   */
  generateId() {
    return 'ai_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * 将AI生成的食谱转换为标准食谱格式
   * @param {object} aiPlan - AI生成的计划
   * @returns {array}
   */
  convertToStandardFormat(aiPlan) {
    const recipes = [];

    if (!aiPlan.days) return recipes;

    aiPlan.days.forEach((day, dayIndex) => {
      const dayName = day.date || `第${dayIndex + 1}天`;

      if (day.meals) {
        const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
        const mealNames = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐', snack: '加餐' };

        mealTypes.forEach(mealType => {
          const meal = day.meals[mealType];
          if (meal && meal.name) {
            recipes.push({
              id: this.generateId(),
              name: meal.name,
              category: mealType,
              mealType: mealType,
              day: dayName,
              dayIndex: dayIndex,
              calories: meal.calories || 0,
              protein: meal.protein || 0,
              carbs: meal.carbs || 0,
              fat: meal.fat || 0,
              fiber: meal.fiber || 0,
              servings: 1,
              time: 30,
              difficulty: 'easy',
              tags: ['AI生成'],
              description: `${dayName}${mealNames[mealType]}`,
              ingredients: (meal.ingredients || []).map(ing => ({
                name: ing,
                amount: '100g'
              })),
              steps: meal.steps || [],
              nutrition: {
                calories: meal.calories || 0,
                protein: meal.protein || 0,
                carbs: meal.carbs || 0,
                fat: meal.fat || 0,
                fiber: meal.fiber || 0
              },
              isAIGenerated: true
            });
          }
        });
      }
    });

    return recipes;
  }
}

// 导出单例
module.exports = new AIService();

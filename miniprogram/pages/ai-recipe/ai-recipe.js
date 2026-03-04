/**
 * pages/ai-recipe/ai-recipe.js - AI食谱生成结果页面
 */

const app = getApp();
const aiService = require('../../services/ai-service.js');
const { showToast, showLoading, hideLoading } = require('../../utils/wx-api.js');

Page({
  /**
   * 页面数据
   */
  data: {
    // 生成类型: daily/weekly
    generateType: 'daily',

    // 生成状态
    status: 'idle', // idle/generating/success/error

    // 生成结果
    result: null,

    // 解析后的食谱列表
    recipes: [],

    // 错误信息
    error: '',

    // 营养建议
    nutritionAdvice: '',

    // 当前查看的天
    currentDay: 0,

    // 生成时间
    generatedAt: ''
  },

  /**
   * 页面加载
   */
  onLoad(options) {
    const { type = 'daily' } = options;
    this.setData({
      generateType: type
    });

    // 加载保存的配置
    aiService.loadConfig();

    // 检查是否已配置
    if (!aiService.isConfigured()) {
      this.setData({
        status: 'error',
        error: '请先在个人中心配置AI API密钥'
      });
      return;
    }

    // 自动开始生成
    this.startGenerate();
  },

  /**
   * 开始生成食谱
   */
  async startGenerate() {
    this.setData({ status: 'generating' });
    showLoading('正在生成食谱...');

    const userProfile = app.globalData.userProfile;

    try {
      let result;

      if (this.data.generateType === 'daily') {
        result = await aiService.generateDailyPlan(userProfile);
      } else {
        result = await aiService.generateWeeklyPlan(userProfile);
      }

      hideLoading();

      if (result.success) {
        this.handleSuccess(result);
      } else {
        this.setData({
          status: 'error',
          error: result.error || '生成失败，请重试'
        });
        showToast(result.error || '生成失败');
      }
    } catch (error) {
      hideLoading();
      console.error('生成食谱失败:', error);
      this.setData({
        status: 'error',
        error: error.message || '生成失败，请检查网络连接'
      });
      showToast('生成失败，请重试');
    }
  },

  /**
   * 处理生成成功
   */
  handleSuccess(result) {
    const plan = result.data;
    const recipes = aiService.convertToStandardFormat(plan);

    this.setData({
      status: 'success',
      result: plan,
      recipes: recipes,
      nutritionAdvice: plan.nutritionAdvice || '保持均衡饮食，注意营养搭配',
      generatedAt: new Date().toLocaleString()
    });

    // 保存到历史
    aiService.saveGeneratedPlan(plan, this.data.generateType);

    showToast('食谱生成成功！');
  },

  /**
   * 重新生成
   */
  onRegenerate() {
    this.startGenerate();
  },

  /**
   * 切换查看的天
   */
  onDayChange(e) {
    const day = parseInt(e.detail.value);
    this.setData({ currentDay: day });
  },

  /**
   * 点击食谱卡片
   */
  onRecipeTap(e) {
    const { recipe } = e.currentTarget.dataset;
    // 可以跳转到食谱详情或显示更多信息
    console.log('查看食谱:', recipe);
  },

  /**
   * 保存到今日记录
   */
  onSaveToToday(e) {
    const { recipe } = e.currentTarget.dataset;
    const { amount } = e.detail;

    try {
      // 构造食物对象
      const food = {
        id: recipe.id,
        name: recipe.name,
        calories: recipe.calories,
        protein: recipe.protein,
        carbs: recipe.carbs,
        fat: recipe.fat,
        fiber: recipe.fiber
      };

      // 添加到对应餐型
      app.addFoodToMeal(recipe.category, food, amount || 100);

      showToast('已添加到今日记录');
    } catch (error) {
      console.error('保存失败:', error);
      showToast('保存失败');
    }
  },

  /**
   * 返回
   */
  onBack() {
    wx.navigateBack();
  },

  /**
   * 查看历史
   */
  onViewHistory() {
    const history = aiService.getGeneratedHistory();
    if (history.length === 0) {
      showToast('暂无历史记录');
      return;
    }

    // 显示历史列表（简化处理，显示最近一次）
    const lastPlan = history[0];
    if (lastPlan) {
      const recipes = aiService.convertToStandardFormat(lastPlan.data);
      this.setData({
        result: lastPlan.data,
        recipes: recipes,
        nutritionAdvice: lastPlan.data.nutritionAdvice || '',
        generatedAt: new Date(lastPlan.createdAt).toLocaleString()
      });
      showToast('已加载历史记录');
    }
  }
});

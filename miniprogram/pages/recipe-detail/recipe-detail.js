/**
 * pages/recipe-detail/recipe-detail.js - 食谱详情页面
 *
 * 修复说明：
 * - 将 Component() 改为 Page()
 * - 移除 lifetimes，使用 onLoad 接收参数
 * - methods 中的方法直接作为页面方法
 * - 转换为 CommonJS 格式以兼容微信小程序
 */
const recipeService = require('../../services/recipe-service.js');
const foodService = require('../../services/food-service.js');
const { showToast } = require('../../utils/wx-api.js');

Page({
  /**
   * 页面数据
   */
  data: {
    // 食谱ID
    recipeId: '',

    // 食谱详情
    recipe: null,

    // 营养分析
    nutritionAnalysis: null,

    // 收藏状态
    isFavorite: false,

    // 当前步骤索引
    currentStep: 0,

    // 加载状态
    loading: true,

    // 份量选择
    servings: 1
  },

  /**
   * 页面生命周期 - 页面加载时触发
   */
  onLoad(options) {
    const recipeId = options.recipeId;

    if (recipeId) {
      this.setData({ recipeId });
      this.loadRecipeDetail(recipeId);
    } else {
      showToast('食谱不存在');
      wx.navigateBack();
    }
  },

  /**
   * 页面生命周期 - 页面显示时触发
   */
  onShow() {
    // 刷新数据
  },

  /**
   * 加载食谱详情
   */
  loadRecipeDetail(recipeId) {
    this.setData({ loading: true });

    try {
      const recipe = recipeService.getRecipeById(recipeId);

      if (!recipe) {
        showToast('食谱不存在');
        wx.navigateBack();
        return;
      }

      // 预计算食材单位
      if (recipe.ingredients) {
        recipe.ingredients = recipe.ingredients.map(item => {
          if (item.foodId) {
            const food = foodService.getFoodById(item.foodId);
            return { ...item, unit: food ? (food.unit || 'g') : 'g' };
          }
          return { ...item, unit: item.unit || 'g' };
        });
      }

      // 分析营养
      const nutritionAnalysis = recipeService.analyzeRecipeNutrition(recipe);

      // 检查收藏状态
      const isFavorite = recipeService.isFavorite(recipeId);

      this.setData({
        recipe,
        nutritionAnalysis,
        isFavorite,
        loading: false
      });
    } catch (error) {
      console.error('加载食谱详情失败:', error);
      showToast('加载失败');
      this.setData({ loading: false });
    }
  },

  /**
   * 切换收藏
   */
  onToggleFavorite() {
    const { recipeId, isFavorite } = this.data;

    if (isFavorite) {
      recipeService.removeFavorite(recipeId);
      showToast('已取消收藏');
    } else {
      recipeService.addFavorite(recipeId);
      showToast('已收藏');
    }

    this.setData({
      isFavorite: !isFavorite
    });
  },

  /**
   * 记录制作
   */
  onRecordCook() {
    const { recipeId } = this.data;
    recipeService.addCookedHistory(recipeId);
    showToast('已记录制作');
  },

  /**
   * 分享食谱
   */
  onShare() {
    showToast('分享功能开发中');
  },

  /**
   * 调整份量
   */
  onServingsChange(e) {
    const servings = parseInt(e.detail.value) || 1;
    this.setData({ servings });
  },

  /**
   * 快速选择份量
   */
  onQuickServings(e) {
    const servings = e.currentTarget.dataset.servings;
    this.setData({ servings });
  },

  /**
   * 上一步
   */
  onPrevStep() {
    const { currentStep } = this.data;
    if (currentStep > 0) {
      this.setData({ currentStep: currentStep - 1 });
    }
  },

  /**
   * 下一步
   */
  onNextStep() {
    const { recipe, currentStep } = this.data;
    if (currentStep < recipe.steps.length - 1) {
      this.setData({ currentStep: currentStep + 1 });
    }
  },

  /**
   * 跳转到指定步骤
   */
  onStepTap(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ currentStep: index });
  },

  /**
   * 查看食材详情
   */
  onIngredientTap(e) {
    const { ingredient } = e.currentTarget.dataset;
    // 可以跳转到食材详情页
    console.log('查看食材:', ingredient);
  },

  /**
   * 返回
   */
  onBack() {
    wx.navigateBack();
  }
});

/**
 * pages/meal-record/meal-record.js - 餐食记录页面
 *
 * 修复说明：
 * - 将 Component() 改为 Page()
 * - 移除 lifetimes，使用 onLoad 和 onShow
 * - methods 中的方法直接作为页面方法
 * - 转换为 CommonJS 格式以兼容微信小程序
 */
const app = getApp();
const foodService = require('../../services/food-service.js');
const { MEAL_TYPE_NAMES } = require('../../utils/constants.js');
const { navigateTo, showToast } = require('../../utils/wx-api.js');

Page({
  /**
   * 页面数据
   */
  data: {
    // 餐型
    mealType: 'lunch',
    mealTypeName: '午餐',

    // 今日该餐的食物列表
    foodList: [],

    // 总营养
    totalNutrition: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    },

    // 输入状态
    showAmountDialog: false,
    selectedFood: null,
    inputAmount: 100,

    // 加载状态
    loading: false
  },

  /**
   * 页面生命周期 - 页面加载时触发
   */
  onLoad(options) {
    const mealType = options.mealType || 'lunch';
    const foodId = options.foodId;

    this.setData({
      mealType,
      mealTypeName: MEAL_TYPE_NAMES[mealType] || '午餐'
    });

    this.loadMealData();

    // 如果有传入食物ID，显示添加对话框
    if (foodId) {
      const food = foodService.getFoodById(foodId);
      if (food) {
        this.showAddDialog(food);
      }
    }
  },

  /**
   * 页面生命周期 - 页面显示时触发
   */
  onShow() {
    // 刷新数据
    this.loadMealData();
  },

  /**
   * 加载餐食数据
   */
  loadMealData() {
    const todayNutrition = app.globalData.todayNutrition;
    const mealData = todayNutrition.meals[this.data.mealType];

    this.setData({
      foodList: mealData.foods || [],
      totalNutrition: {
        calories: mealData.calories || 0,
        protein: mealData.protein || 0,
        carbs: mealData.carbs || 0,
        fat: mealData.fat || 0,
        fiber: mealData.fiber || 0
      }
    });
  },

  /**
   * 显示添加对话框
   */
  showAddDialog(food) {
    this.setData({
      showAmountDialog: true,
      selectedFood: food,
      inputAmount: 100
    });
  },

  /**
   * 关闭对话框
   */
  closeDialog() {
    this.setData({
      showAmountDialog: false,
      selectedFood: null,
      inputAmount: 100
    });
  },

  /**
   * 输入份量变化
   */
  onAmountChange(e) {
    this.setData({
      inputAmount: parseInt(e.detail.value) || 0
    });
  },

  /**
   * 快速选择份量
   */
  onQuickAmount(e) {
    const amount = e.currentTarget.dataset.amount;
    this.setData({ inputAmount: amount });
  },

  /**
   * 确认添加
   */
  onConfirmAdd() {
    const { selectedFood, inputAmount } = this.data;

    if (!selectedFood || inputAmount <= 0) {
      showToast('请输入有效的份量');
      return;
    }

    // 添加到全局数据
    const success = app.addFoodToMeal(this.data.mealType, selectedFood, inputAmount);

    if (success) {
      showToast('添加成功');
      this.closeDialog();
      this.loadMealData();
    } else {
      showToast('添加失败，请重试');
    }
  },

  /**
   * 删除食物
   */
  onDeleteFood(e) {
    const { index } = e.currentTarget.dataset;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      success: (res) => {
        if (res.confirm) {
          const success = app.removeFoodFromMeal(this.data.mealType, index);

          if (success) {
            showToast('删除成功');
            this.loadMealData();
          } else {
            showToast('删除失败');
          }
        }
      }
    });
  },

  /**
   * 添加食物
   */
  onAddFood() {
    // food-search 是 tabBar 页面，需用 switchTab
    wx.switchTab({
      url: '/pages/food-search/food-search'
    });
  },

  /**
   * 查看营养详情
   */
  onNutritionDetail() {
    wx.showModal({
      title: '营养详情',
      content: `热量: ${this.data.totalNutrition.calories}kcal\n蛋白质: ${this.data.totalNutrition.protein}g\n碳水: ${this.data.totalNutrition.carbs}g\n脂肪: ${this.data.totalNutrition.fat}g\n纤维: ${this.data.totalNutrition.fiber}g`,
      showCancel: false
    });
  },

  /**
   * 分享餐食
   */
  onShare() {
    showToast('分享功能开发中');
  }
});

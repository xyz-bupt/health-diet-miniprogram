/**
 * pages/index/index.js - 首页
 * 显示今日营养摄入概览
 *
 * 修复说明：
 * - 将 Component() 改为 Page()
 * - 移除 properties 和 pageLifetimes，使用 onLoad 和 onShow
 * - methods 中的方法直接作为页面方法
 */
const app = getApp();

Page({
  /**
   * 页面数据
   */
  data: {
    // 用户信息
    userInfo: null,
    userProfile: null,

    // 今日营养数据
    todayNutrition: null,
    nutritionTargets: {},

    // 餐食数据
    meals: [
      { key: 'breakfast', name: '早餐', icon: '🌅', total: 0 },
      { key: 'lunch', name: '午餐', icon: '☀️', total: 0 },
      { key: 'dinner', name: '晚餐', icon: '🌙', total: 0 },
      { key: 'snack', name: '加餐', icon: '🍎', total: 0 }
    ],

    // 健康评分
    healthScore: {},

    // 剩余热量
    remainingCalories: 0,

    // 热量来源分布
    calorieDistribution: {},

    // 加载状态
    loading: true,

    // 日期
    currentDate: ''
  },

  /**
   * 页面生命周期 - 页面加载时触发
   */
  onLoad(options) {
    this.loadData();
    this.setCurrentDate();
  },

  /**
   * 页面生命周期 - 页面显示时触发
   */
  onShow() {
    // 页面显示时刷新数据
    this.loadData();
  },

  /**
   * 页面生命周期 - 下拉刷新
   */
  onPullDownRefresh() {
    this.onRefresh();
  },

  /**
   * 设置当前日期
   */
  setCurrentDate() {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekDay = weekDays[date.getDay()];

    this.setData({
      currentDate: `${month}月${day}日 ${weekDay}`
    });
  },

  /**
   * 加载数据
   */
  async loadData() {
    this.setData({ loading: true });

    try {
      // 获取全局数据
      const globalData = app.globalData;
      const userProfile = globalData.userProfile;
      const todayNutrition = globalData.todayNutrition;

      // 设置营养目标
      const nutritionTargets = {
        calories: userProfile.dailyCalorieTarget,
        protein: userProfile.proteinTarget,
        carbs: userProfile.carbsTarget,
        fat: userProfile.fatTarget,
        fiber: userProfile.fiberTarget
      };

      // 更新餐食数据
      const meals = this.data.meals.map(meal => ({
        ...meal,
        total: (todayNutrition.meals[meal.key] && todayNutrition.meals[meal.key].calories) || 0
      }));

      // 计算剩余热量
      const remainingCalories = nutritionTargets.calories - (todayNutrition.total?.calories || 0);

      // 计算健康评分
      const healthScore = this.calculateHealthScore(todayNutrition.total, nutritionTargets);

      // 计算热量分布
      const calorieDistribution = this.calculateCalorieDistribution(todayNutrition.total);

      this.setData({
        userProfile,
        todayNutrition,
        nutritionTargets,
        meals,
        remainingCalories,
        healthScore,
        calorieDistribution,
        loading: false
      });
    } catch (error) {
      console.error('加载首页数据失败:', error);
      this.setData({ loading: false });
    }
  },

  /**
   * 计算健康评分
   */
  calculateHealthScore(total, targets) {
    if (!total || !targets) {
      return { score: 0, text: '数据不足', color: '#999999' };
    }

    // 计算各项得分
    const calorieScore = this.calculateScore(total.calories, targets.calories, 0.9, 1.1);
    const proteinScore = this.calculateScore(total.protein, targets.protein, 0.8, 1.2);
    const carbsScore = this.calculateScore(total.carbs, targets.carbs, 0.8, 1.2);
    const fatScore = this.calculateScore(total.fat, targets.fat, 0.8, 1.2);
    const fiberScore = this.calculateScore(total.fiber, targets.fiber, 0.7, 100);

    // 综合得分
    const score = Math.round(
      calorieScore * 0.25 +
      proteinScore * 0.25 +
      carbsScore * 0.2 +
      fatScore * 0.15 +
      fiberScore * 0.15
    );

    // 评价
    let text, color;
    if (score >= 90) {
      text = '优秀';
      color = '#4CAF50';
    } else if (score >= 75) {
      text = '良好';
      color = '#8BC34A';
    } else if (score >= 60) {
      text = '一般';
      color = '#FF9800';
    } else {
      text = '需改善';
      color = '#F44336';
    }

    return { score, text, color };
  },

  /**
   * 计算单项得分
   */
  calculateScore(current, target, minRatio, maxRatio) {
    if (!target || target <= 0) return 0;

    const ratio = current / target;

    if (ratio >= minRatio && ratio <= maxRatio) {
      return 100;
    } else if (ratio < minRatio) {
      return Math.round((ratio / minRatio) * 100);
    } else {
      return Math.max(0, Math.round(100 - (ratio - maxRatio) * 50));
    }
  },

  /**
   * 计算热量分布
   */
  calculateCalorieDistribution(total) {
    if (!total) return {};

    const proteinCalories = total.protein * 4;
    const carbsCalories = total.carbs * 4;
    const fatCalories = total.fat * 9;
    const totalCalories = total.calories || 1;

    return {
      protein: Math.round((proteinCalories / totalCalories) * 100),
      carbs: Math.round((carbsCalories / totalCalories) * 100),
      fat: Math.round((fatCalories / totalCalories) * 100)
    };
  },

  /**
   * 点击餐食
   */
  onMealTap(e) {
    const { mealType } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/meal-record/meal-record?mealType=${mealType}`
    });
  },

  /**
   * 添加食物
   */
  onAddFood() {
    wx.switchTab({
      url: '/pages/food-search/food-search'
    });
  },

  /**
   * 查看食谱
   */
  onRecipes() {
    wx.switchTab({
      url: '/pages/recipe-list/recipe-list'
    });
  },

  /**
   * 查看个人资料
   */
  onProfile() {
    wx.switchTab({
      url: '/pages/profile/profile'
    });
  },

  /**
   * 下拉刷新
   */
  onRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh();
    });
  }
});

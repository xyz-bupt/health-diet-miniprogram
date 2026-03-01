/**
 * pages/food-search/food-search.js - 食物搜索页面
 *
 * 修复说明：
 * - 将 Component() 改为 Page()
 * - 移除 lifetimes，使用 onLoad 和 onShow
 * - methods 中的方法直接作为页面方法
 * - 转换为 CommonJS 格式以兼容微信小程序
 */
const foodService = require('../../services/food-service.js');
const { navigateTo, showToast } = require('../../utils/wx-api.js');
const { debounce } = require('../../utils/helpers.js');

Page({
  /**
   * 页面数据
   */
  data: {
    // 搜索关键词
    keyword: '',
    // 搜索结果
    searchResults: [],
    // 热门食物
    popularFoods: [],
    // 分类列表
    categories: [],
    // 当前分类
    currentCategory: 'all',
    // 加载状态
    loading: false,
    // 是否显示搜索结果
    showResults: false,
    // 筛选条件
    filters: {
      category: 'all',
      maxCalories: null
    },
    // 筛选面板显示状态
    showFilterPanel: false
  },

  /**
   * 页面生命周期 - 页面加载时触发
   */
  onLoad(options) {
    this.loadData();
  },

  /**
   * 页面生命周期 - 页面显示时触发
   */
  onShow() {
    // 刷新数据
  },

  /**
   * 页面生命周期 - 下拉刷新
   */
  onPullDownRefresh() {
    this.onRefresh();
  },

  /**
   * 加载数据
   */
  loadData() {
    this.setData({
      popularFoods: foodService.getPopularFoods(10),
      categories: foodService.getFoodCategories()
    });
  },

  /**
   * 搜索输入处理（防抖）
   */
  onSearchInput: debounce(function(e) {
    const keyword = e.detail.value;
    this.setData({ keyword });

    if (keyword.trim()) {
      this.performSearch(keyword);
    } else {
      this.setData({ showResults: false, searchResults: [] });
    }
  }, 300),

  /**
   * 执行搜索
   */
  performSearch(keyword) {
    this.setData({ loading: true });

    try {
      const results = foodService.searchFoods(keyword, this.data.filters);
      this.setData({
        searchResults: results,
        showResults: true,
        loading: false
      });
    } catch (error) {
      console.error('搜索失败:', error);
      showToast('搜索失败，请重试');
      this.setData({ loading: false });
    }
  },

  /**
   * 搜索确认
   */
  onSearchConfirm(e) {
    const keyword = e.detail.value;
    if (keyword.trim()) {
      this.performSearch(keyword);
    }
  },

  /**
   * 清空搜索
   */
  onClearSearch() {
    this.setData({
      keyword: '',
      searchResults: [],
      showResults: false
    });
  },

  /**
   * 点击分类
   */
  onCategoryTap(e) {
    const categoryId = e.currentTarget.dataset.id;
    this.setData({
      currentCategory: categoryId,
      filters: { ...this.data.filters, category: categoryId }
    });

    // 如果有搜索关键词，重新搜索
    if (this.data.keyword.trim()) {
      this.performSearch(this.data.keyword);
    } else {
      // 显示分类下的食物
      this.showCategoryFoods(categoryId);
    }
  },

  /**
   * 显示分类食物
   */
  showCategoryFoods(categoryId) {
    if (categoryId === 'all') {
      this.setData({
        searchResults: foodService.getPopularFoods(20),
        showResults: true
      });
    } else {
      this.setData({
        searchResults: foodService.getFoodsByCategory(categoryId),
        showResults: true
      });
    }
  },

  /**
   * 点击食物卡片
   */
  onFoodTap(e) {
    // 兼容组件自定义事件(e.detail.food)和原生tap事件(e.currentTarget.dataset.food)
    const food = (e.detail && e.detail.food) || (e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.food);
    if (food) {
      this.showFoodDialog(food);
    }
  },

  /**
   * 显示食物对话框
   */
  showFoodDialog(food) {
    // 这里可以弹出对话框让用户输入份量
    // 简化处理：直接跳转到餐食记录页面
    navigateTo('/pages/meal-record/meal-record', {
      foodId: food.id
    });
  },

  /**
   * 切换筛选面板
   */
  onToggleFilter() {
    this.setData({
      showFilterPanel: !this.data.showFilterPanel
    });
  },

  /**
   * 应用筛选
   */
  onApplyFilter(e) {
    const dataset = e.currentTarget.dataset;
    const maxCalories = dataset.maxCalories;
    this.setData({
      filters: {
        ...this.data.filters,
        maxCalories: maxCalories != null ? maxCalories : null
      },
      showFilterPanel: false
    });

    // 重新搜索
    if (this.data.keyword.trim()) {
      this.performSearch(this.data.keyword);
    }
  },

  /**
   * 重置筛选
   */
  onResetFilter() {
    this.setData({
      filters: {
        category: 'all',
        maxCalories: null
      },
      showFilterPanel: false,
      currentCategory: 'all'
    });

    // 重新搜索
    if (this.data.keyword.trim()) {
      this.performSearch(this.data.keyword);
    }
  },

  /**
   * 阻止事件冒泡（用于筛选面板）
   */
  stopPropagation() {
    // 空函数，仅用于阻止事件冒泡
  },

  /**
   * 下拉刷新
   */
  onRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  }
});

/**
 * pages/recipe-list/recipe-list.js - 食谱列表页面
 *
 * 修复说明：
 * - 将 Component() 改为 Page()
 * - 移除 lifetimes，使用 onLoad 和 onShow
 * - methods 中的方法直接作为页面方法
 * - 转换为 CommonJS 格式以兼容微信小程序
 */
const recipeService = require('../../services/recipe-service.js');
const { navigateTo, showToast } = require('../../utils/wx-api.js');
const { debounce } = require('../../utils/helpers.js');
const foodService = require('../../services/food-service.js');

Page({
  /**
   * 页面数据
   */
  data: {
    // 当前分类
    currentCategory: 'all',

    // 分类列表
    categories: [],

    // 食谱列表
    recipeList: [],

    // 热门食谱
    popularRecipes: [],

    // 加载状态
    loading: false,

    // 搜索关键词
    keyword: '',

    // 筛选条件
    filters: {
      maxTime: null,
      difficulty: null
    },

    // 筛选面板显示
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
      categories: recipeService.getRecipeCategories(),
      popularRecipes: recipeService.getPopularRecipes(10)
    });
    this.loadRecipes('all');
  },

  /**
   * 加载食谱
   */
  loadRecipes(category) {
    this.setData({ loading: true });

    try {
      let recipes;
      if (category === 'all') {
        recipes = recipeService.getPopularRecipes(20);
      } else {
        recipes = recipeService.getRecipesByCategory(category);
      }

      // 应用当前筛选条件
      const { filters } = this.data;
      if (filters.maxTime) {
        recipes = recipes.filter(r => r.time <= filters.maxTime);
      }
      if (filters.difficulty) {
        recipes = recipes.filter(r => r.difficulty === filters.difficulty);
      }

      this.setData({
        recipeList: recipes,
        currentCategory: category,
        loading: false
      });
    } catch (error) {
      console.error('加载食谱失败:', error);
      showToast('加载失败，请重试');
      this.setData({ loading: false });
    }
  },

  /**
   * 切换分类
   */
  onCategoryTap(e) {
    const category = e.currentTarget.dataset.id;
    this.loadRecipes(category);
  },

  /**
   * 搜索输入处理
   */
  onSearchInput: debounce(function(e) {
    const keyword = e.detail.value;
    this.setData({ keyword });

    if (keyword.trim()) {
      this.performSearch(keyword);
    } else {
      this.loadRecipes(this.data.currentCategory);
    }
  }, 300),

  /**
   * 执行搜索
   */
  performSearch(keyword) {
    this.setData({ loading: true });

    try {
      const results = recipeService.searchRecipes(keyword, this.data.filters);
      this.setData({
        recipeList: results,
        loading: false
      });
    } catch (error) {
      console.error('搜索失败:', error);
      showToast('搜索失败');
      this.setData({ loading: false });
    }
  },

  /**
   * 点击食谱
   */
  onRecipeTap(e) {
    const { recipe } = e.currentTarget.dataset;
    navigateTo('/pages/recipe-detail/recipe-detail', {
      recipeId: recipe.id
    });
  },

  /**
   * 收藏食谱
   */
  onFavoriteTap(e) {
    const { recipe, index } = e.currentTarget.dataset;
    // catchtap already prevents event propagation

    const isFavorite = recipeService.isFavorite(recipe.id);

    if (isFavorite) {
      recipeService.removeFavorite(recipe.id);
      showToast('已取消收藏');
    } else {
      recipeService.addFavorite(recipe.id);
      showToast('已收藏');
    }

    // 更新列表
    const recipeList = this.data.recipeList;
    recipeList[index].isFavorite = !isFavorite;
    this.setData({ recipeList });
  },

  /**
   * 打开筛选
   */
  onOpenFilter() {
    this.setData({ showFilterPanel: true });
  },

  /**
   * 关闭筛选
   */
  onCloseFilter() {
    this.setData({ showFilterPanel: false });
  },

  /**
   * 应用筛选
   */
  onApplyFilter(e) {
    const dataset = e.currentTarget.dataset;
    const filters = { ...this.data.filters };

    // 每个选项只传一个筛选字段，分别处理
    if ('maxTime' in dataset) {
      filters.maxTime = dataset.maxTime != null ? dataset.maxTime : null;
    }
    if ('difficulty' in dataset) {
      filters.difficulty = dataset.difficulty || null;
    }

    this.setData({ filters });

    // 重新加载
    if (this.data.keyword.trim()) {
      this.performSearch(this.data.keyword);
    } else {
      this.loadRecipes(this.data.currentCategory);
    }
  },

  /**
   * 重置筛选
   */
  onResetFilter() {
    this.setData({
      filters: {
        maxTime: null,
        difficulty: null
      },
      showFilterPanel: false
    });

    this.loadRecipes(this.data.currentCategory);
  },

  /**
   * 根据食材推荐
   */
  onRecommendByIngredients() {
    showToast('功能开发中');
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

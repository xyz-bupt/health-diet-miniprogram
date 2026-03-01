/**
 * recipe-service.js - 食谱服务
 * 提供食谱搜索、筛选、推荐等功能
 *
 * 修复说明：
 * - 转换为 CommonJS 格式以兼容微信小程序
 * - 使用 require 和 module.exports
 */

const recipeDatabase = require('../data/recipe-database.js');
const { MEAL_TYPE_NAMES, RECIPE_CATEGORY_NAMES } = require('../utils/constants.js');

/**
 * 食谱服务类
 */
class RecipeService {
  constructor() {
    this.recipeDatabase = recipeDatabase;
    this.favoriteRecipes = [];
    this.cookedHistory = [];
  }

  /**
   * 获取所有食谱分类
   * @returns {array} 食谱分类列表
   */
  getRecipeCategories() {
    return [
      { id: 'breakfast', name: RECIPE_CATEGORY_NAMES.breakfast, icon: '🌅' },
      { id: 'lunch', name: RECIPE_CATEGORY_NAMES.lunch, icon: '☀️' },
      { id: 'dinner', name: RECIPE_CATEGORY_NAMES.dinner, icon: '🌙' },
      { id: 'snack', name: RECIPE_CATEGORY_NAMES.snack, icon: '🍎' },
      { id: 'vegetarian', name: RECIPE_CATEGORY_NAMES.vegetarian, icon: '🥬' }
    ];
  }

  /**
   * 获取指定分类的食谱
   * @param {string} category - 分类ID
   * @returns {array} 食谱列表
   */
  getRecipesByCategory(category) {
    return this.recipeDatabase.getRecipesByCategory(category) || [];
  }

  /**
   * 根据ID获取食谱
   * @param {string} recipeId - 食谱ID
   * @returns {object|null} 食谱对象
   */
  getRecipeById(recipeId) {
    return this.recipeDatabase.getRecipeById(recipeId) || null;
  }

  /**
   * 搜索食谱
   * @param {string} keyword - 搜索关键词
   * @param {object} filters - 筛选条件
   * @returns {array} 搜索结果
   */
  searchRecipes(keyword, filters = {}) {
    let results = this.recipeDatabase.searchRecipes(keyword);

    // 应用分类筛选
    if (filters.category && filters.category !== 'all') {
      results = results.filter(recipe => recipe.category === filters.category);
    }

    // 应用标签筛选
    if (filters.tag) {
      results = results.filter(recipe =>
        recipe.tags && recipe.tags.includes(filters.tag)
      );
    }

    // 应用难度筛选
    if (filters.difficulty) {
      results = results.filter(recipe => recipe.difficulty === filters.difficulty);
    }

    // 应用时间筛选
    if (filters.maxTime) {
      results = results.filter(recipe => recipe.time <= filters.maxTime);
    }

    // 应用热量筛选
    if (filters.minCalories) {
      results = results.filter(recipe =>
        recipe.nutrition.calories >= filters.minCalories
      );
    }
    if (filters.maxCalories) {
      results = results.filter(recipe =>
        recipe.nutrition.calories <= filters.maxCalories
      );
    }

    // 排序
    if (filters.sortBy) {
      results = this.sortRecipes(results, filters.sortBy, filters.sortOrder);
    }

    return results;
  }

  /**
   * 食谱排序
   * @param {array} recipes - 食谱列表
   * @param {string} sortBy - 排序字段
   * @param {string} order - 排序方向
   * @returns {array} 排序后的列表
   */
  sortRecipes(recipes, sortBy = 'name', order = 'asc') {
    return recipes.slice().sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];

      if (typeof valueA === 'string') {
        return order === 'asc'
          ? valueA.localeCompare(valueB, 'zh-CN')
          : valueB.localeCompare(valueA, 'zh-CN');
      }

      if (order === 'asc') {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });
  }

  /**
   * 获取热门食谱
   * @param {number} limit - 数量限制
   * @returns {array} 热门食谱列表
   */
  getPopularRecipes(limit = 10) {
    const popularRecipeIds = [
      'rl001', // 香菇滑鸡饭
      'rl002', // 西红柿炒鸡蛋
      'rl005', // 西兰花炒虾仁
      'rb001', // 牛奶燕麦粥
      'rb002', // 全麦鸡蛋三明治
      'rd003', // 白灼菜心
      'rd006', // 紫菜蛋花汤
      'rl003', // 清蒸鲈鱼
      'rb005', // 水果酸奶杯
      'rv001'  // 宫保杏鲍菇
    ];

    const recipes = popularRecipeIds
      .map(id => this.getRecipeById(id))
      .filter(recipe => recipe !== null);

    return recipes.slice(0, limit);
  }

  /**
   * 获取推荐食谱
   * @param {string} goal - 健康目标 (lose/maintain/gain)
   * @param {string} mealType - 餐型
   * @param {number} limit - 数量限制
   * @returns {array} 推荐食谱列表
   */
  getRecommendedRecipes(goal = 'maintain', mealType = 'lunch', limit = 5) {
    const recommendations = {
      lose: {
        breakfast: ['rb001', 'rb003', 'rb005'],
        lunch: ['rl003', 'rl005', 'rl004'],
        dinner: ['rd001', 'rd002', 'rd003'],
        snack: ['rs001', 'rs002']
      },
      maintain: {
        breakfast: ['rb001', 'rb002', 'rb004'],
        lunch: ['rl001', 'rl002', 'rl005'],
        dinner: ['rd002', 'rd004', 'rd005'],
        snack: ['rs001', 'rs003']
      },
      gain: {
        breakfast: ['rb002', 'rb004'],
        lunch: ['rl001', 'rl006', 'rl002'],
        dinner: ['rd002', 'rd005'],
        snack: ['rs002', 'rs003', 'rs004']
      }
    };

    const recipeIds = recommendations[goal]?.[mealType] || [];
    const recipes = recipeIds
      .map(id => this.getRecipeById(id))
      .filter(recipe => recipe !== null);

    return recipes.slice(0, limit);
  }

  /**
   * 根据食材推荐食谱
   * @param {array} ingredients - 食材列表
   * @param {number} limit - 数量限制
   * @returns {array} 推荐食谱列表
   */
  getRecipesByIngredients(ingredients, limit = 10) {
    if (!ingredients || ingredients.length === 0) {
      return this.getPopularRecipes(limit);
    }

    const allRecipes = this.recipeDatabase.getAllRecipes();

    // 匹配包含指定食材的食谱
    const matchedRecipes = allRecipes
      .map(recipe => {
        let matchCount = 0;
        const ingredientNames = recipe.ingredients.map(ing => ing.name);

        ingredients.forEach(ingredient => {
          if (ingredientNames.some(name => name.includes(ingredient) || ingredient.includes(name))) {
            matchCount++;
          }
        });

        return { recipe, matchCount };
      })
      .filter(item => item.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)
      .map(item => item.recipe);

    return matchedRecipes.slice(0, limit);
  }

  /**
   * 根据热量范围获取食谱
   * @param {number} minCalories - 最小热量
   * @param {number} maxCalories - 最大热量
   * @param {number} limit - 数量限制
   * @returns {array} 食谱列表
   */
  getRecipesByCalories(minCalories, maxCalories, limit = 20) {
    return this.recipeDatabase
      .getRecipesByCalories(minCalories, maxCalories)
      .slice(0, limit);
  }

  /**
   * 根据标签获取食谱
   * @param {string} tag - 标签
   * @param {number} limit - 数量限制
   * @returns {array} 食谱列表
   */
  getRecipesByTag(tag, limit = 10) {
    return this.recipeDatabase
      .getRecipesByTag(tag)
      .slice(0, limit);
  }

  /**
   * 获取快手食谱
   * @param {number} maxTime - 最长时间（分钟）
   * @param {number} limit - 数量限制
   * @returns {array} 快手食谱列表
   */
  getQuickRecipes(maxTime = 20, limit = 10) {
    const allRecipes = this.recipeDatabase.getAllRecipes();

    return allRecipes
      .filter(recipe => recipe.time <= maxTime)
      .sort((a, b) => a.time - b.time)
      .slice(0, limit);
  }

  /**
   * 获取简单食谱
   * @param {number} limit - 数量限制
   * @returns {array} 简单食谱列表
   */
  getEasyRecipes(limit = 10) {
    const allRecipes = this.recipeDatabase.getAllRecipes();

    return allRecipes
      .filter(recipe => recipe.difficulty === 'easy')
      .slice(0, limit);
  }

  /**
   * 添加收藏
   * @param {string} recipeId - 食谱ID
   */
  addFavorite(recipeId) {
    if (!this.favoriteRecipes.includes(recipeId)) {
      this.favoriteRecipes.push(recipeId);
    }
  }

  /**
   * 取消收藏
   * @param {string} recipeId - 食谱ID
   */
  removeFavorite(recipeId) {
    this.favoriteRecipes = this.favoriteRecipes.filter(id => id !== recipeId);
  }

  /**
   * 检查是否已收藏
   * @param {string} recipeId - 食谱ID
   * @returns {boolean}
   */
  isFavorite(recipeId) {
    return this.favoriteRecipes.includes(recipeId);
  }

  /**
   * 获取收藏列表
   * @returns {array} 收藏的食谱列表
   */
  getFavorites() {
    return this.favoriteRecipes
      .map(id => this.getRecipeById(id))
      .filter(recipe => recipe !== null);
  }

  /**
   * 记录制作
   * @param {string} recipeId - 食谱ID
   */
  addCookedHistory(recipeId) {
    this.cookedHistory.unshift({
      recipeId,
      time: new Date().getTime()
    });

    // 限制历史记录长度
    if (this.cookedHistory.length > 50) {
      this.cookedHistory = this.cookedHistory.slice(0, 50);
    }
  }

  /**
   * 获取制作历史
   * @param {number} limit - 数量限制
   * @returns {array} 制作历史
   */
  getCookedHistory(limit = 20) {
    return this.cookedHistory
      .slice(0, limit)
      .map(item => ({
        ...item,
        recipe: this.getRecipeById(item.recipeId)
      }));
  }

  /**
   * 获取最近制作的食谱
   * @param {number} limit - 数量限制
   * @returns {array} 食谱列表
   */
  getRecentlyCooked(limit = 5) {
    const recentIds = this.cookedHistory
      .slice(0, limit * 2) // 获取更多，去重后再限制
      .map(item => item.recipeId);

    // 去重
    const uniqueIds = [...new Set(recentIds)];

    return uniqueIds
      .slice(0, limit)
      .map(id => this.getRecipeById(id))
      .filter(recipe => recipe !== null);
  }

  /**
   * 分析食谱营养价值
   * @param {object} recipe - 食谱对象
   * @returns {object} 分析结果
   */
  analyzeRecipeNutrition(recipe) {
    const nutrition = recipe.nutrition || {};

    // 计算热量来源分布
    const proteinCalories = nutrition.protein * 4;
    const carbsCalories = nutrition.carbs * 4;
    const fatCalories = nutrition.fat * 9;
    const totalCalories = nutrition.calories || 1;

    const distribution = {
      protein: {
        calories: proteinCalories,
        percentage: Math.round((proteinCalories / totalCalories) * 100)
      },
      carbs: {
        calories: carbsCalories,
        percentage: Math.round((carbsCalories / totalCalories) * 100)
      },
      fat: {
        calories: fatCalories,
        percentage: Math.round((fatCalories / totalCalories) * 100)
      }
    };

    // 营养特点
    const features = [];
    if (nutrition.calories <= 300) features.push('低热量');
    if (nutrition.calories >= 500) features.push('高热量');
    if (nutrition.protein >= 20) features.push('高蛋白');
    if (nutrition.fat <= 10) features.push('低脂');
    if (nutrition.fiber >= 5) features.push('高纤维');

    return {
      nutrition,
      distribution,
      features,
      perServing: {
        calories: Math.round(nutrition.calories / recipe.servings),
        protein: Math.round((nutrition.protein / recipe.servings) * 10) / 10,
        carbs: Math.round((nutrition.carbs / recipe.servings) * 10) / 10,
        fat: Math.round((nutrition.fat / recipe.servings) * 10) / 10
      }
    };
  }

  /**
   * 生成一周食谱计划
   * @param {string} goal - 健康目标
   * @param {number} dailyCalories - 每日热量目标
   * @returns {object} 一周食谱计划
   */
  generateWeeklyPlan(goal = 'maintain', dailyCalories = 2000) {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const mealTypes = ['breakfast', 'lunch', 'dinner'];

    const weeklyPlan = {};

    days.forEach(day => {
      weeklyPlan[day] = {};

      mealTypes.forEach(mealType => {
        const recipes = this.getRecommendedRecipes(goal, mealType, 3);
        // 随机选择一个
        const recipe = recipes[Math.floor(Math.random() * recipes.length)];
        weeklyPlan[day][mealType] = recipe;
      });
    });

    return {
      goal,
      dailyCalories,
      plan: weeklyPlan
    };
  }

  /**
   * 获取食谱统计数据
   * @returns {object} 统计信息
   */
  getRecipeStats() {
    const allRecipes = this.recipeDatabase.getAllRecipes();
    const categoryStats = this.recipeDatabase.getCategoryStats();

    // 难度分布
    const difficultyDistribution = {
      easy: allRecipes.filter(r => r.difficulty === 'easy').length,
      medium: allRecipes.filter(r => r.difficulty === 'medium').length,
      hard: allRecipes.filter(r => r.difficulty === 'hard').length
    };

    // 平均制作时间
    const avgTime = Math.round(
      allRecipes.reduce((sum, r) => sum + r.time, 0) / allRecipes.length
    );

    // 热量分布
    const avgCalories = Math.round(
      allRecipes.reduce((sum, r) => sum + r.nutrition.calories, 0) / allRecipes.length
    );

    return {
      totalRecipes: allRecipes.length,
      categoryStats,
      difficultyDistribution,
      avgTime,
      avgCalories
    };
  }

  /**
   * 根据用户偏好获取推荐
   * @param {object} preferences - 用户偏好
   * @returns {array} 推荐食谱列表
   */
  getPersonalizedRecommendations(preferences) {
    let recipes = this.recipeDatabase.getAllRecipes();

    // 根据目标筛选
    if (preferences.goal === 'lose') {
      recipes = recipes.filter(r => r.nutrition.calories < 400);
    } else if (preferences.goal === 'gain') {
      recipes = recipes.filter(r => r.nutrition.calories > 300);
    }

    // 根据饮食偏好筛选
    if (preferences.vegetarian) {
      recipes = recipes.filter(r => r.category === 'vegetarian');
    }

    // 根据难度筛选
    if (preferences.maxDifficulty) {
      const difficultyOrder = ['easy', 'medium', 'hard'];
      const maxIndex = difficultyOrder.indexOf(preferences.maxDifficulty);
      recipes = recipes.filter(r =>
        difficultyOrder.indexOf(r.difficulty) <= maxIndex
      );
    }

    // 根据时间筛选
    if (preferences.maxTime) {
      recipes = recipes.filter(r => r.time <= preferences.maxTime);
    }

    // 随机打乱并返回
    return recipes
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
  }
}

// 导出单例
module.exports = new RecipeService();

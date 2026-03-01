/**
 * food-service.js - 食物数据服务
 * 提供食物搜索、筛选、推荐等功能
 *
 * 修复说明：
 * - 转换为 CommonJS 格式以兼容微信小程序
 * - 使用 require 和 module.exports
 */

const foodDatabase = require('../data/food-database.js');
const foodCategories = require('../data/food-categories.js');
const { FOOD_CATEGORIES } = require('../utils/constants.js');
const { calculateFoodNutrition, calculateCaloriePercentage } = require('../utils/nutrition-calculator.js');

/**
 * 食物服务类
 */
class FoodService {
  constructor() {
    this.foodDatabase = foodDatabase;
    this.categories = foodCategories;
    this.searchHistory = [];
    this.maxHistoryLength = 20;
  }

  /**
   * 获取所有食物分类
   * @returns {array} 食物分类列表
   */
  getFoodCategories() {
    return this.categories.categories;
  }

  /**
   * 获取指定分类的食物
   * @param {string} categoryId - 分类ID
   * @returns {array} 食物列表
   */
  getFoodsByCategory(categoryId) {
    return this.foodDatabase.getFoodsByCategory(categoryId) || [];
  }

  /**
   * 搜索食物
   * @param {string} keyword - 搜索关键词
   * @param {object} filters - 筛选条件
   * @returns {array} 搜索结果
   */
  searchFoods(keyword, filters = {}) {
    let results = this.foodDatabase.searchFoods(keyword);

    // 应用筛选条件
    if (filters.category && filters.category !== 'all') {
      results = results.filter(food => food.category === filters.category);
    }

    if (filters.minCalories) {
      results = results.filter(food => food.calories >= filters.minCalories);
    }

    if (filters.maxCalories) {
      results = results.filter(food => food.calories <= filters.maxCalories);
    }

    if (filters.minProtein) {
      results = results.filter(food => food.protein >= filters.minProtein);
    }

    if (filters.maxFat) {
      results = results.filter(food => food.fat <= filters.maxFat);
    }

    // 排序
    if (filters.sortBy) {
      results = this.sortFoods(results, filters.sortBy, filters.sortOrder);
    }

    // 记录搜索历史
    if (keyword && keyword.trim()) {
      this.addSearchHistory(keyword);
    }

    return results;
  }

  /**
   * 食物排序
   * @param {array} foods - 食物列表
   * @param {string} sortBy - 排序字段
   * @param {string} order - 排序方向
   * @returns {array} 排序后的列表
   */
  sortFoods(foods, sortBy = 'name', order = 'asc') {
    return foods.slice().sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];

      // 中文字符串排序
      if (typeof valueA === 'string') {
        return order === 'asc'
          ? valueA.localeCompare(valueB, 'zh-CN')
          : valueB.localeCompare(valueA, 'zh-CN');
      }

      // 数字排序
      if (order === 'asc') {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });
  }

  /**
   * 根据ID获取食物
   * @param {string} foodId - 食物ID
   * @returns {object|null} 食物对象
   */
  getFoodById(foodId) {
    return this.foodDatabase.getFoodById(foodId) || null;
  }

  /**
   * 根据ID批量获取食物
   * @param {array} foodIds - 食物ID数组
   * @returns {array} 食物对象数组
   */
  getFoodsByIds(foodIds) {
    return foodIds
      .map(id => this.getFoodById(id))
      .filter(food => food !== null);
  }

  /**
   * 添加搜索历史
   * @param {string} keyword - 搜索关键词
   */
  addSearchHistory(keyword) {
    // 移除已存在的相同关键词
    this.searchHistory = this.searchHistory.filter(item => item !== keyword);

    // 添加到开头
    this.searchHistory.unshift(keyword);

    // 限制历史记录长度
    if (this.searchHistory.length > this.maxHistoryLength) {
      this.searchHistory = this.searchHistory.slice(0, this.maxHistoryLength);
    }
  }

  /**
   * 获取搜索历史
   * @returns {array} 搜索历史
   */
  getSearchHistory() {
    return this.searchHistory;
  }

  /**
   * 清空搜索历史
   */
  clearSearchHistory() {
    this.searchHistory = [];
  }

  /**
   * 获取热门食物
   * @param {number} limit - 数量限制
   * @returns {array} 热门食物列表
   */
  getPopularFoods(limit = 20) {
    // 定义常见食物列表
    const popularFoodIds = [
      'g001', // 米饭
      'g008', // 馒头
      'v002', // 小白菜
      'v008', // 西兰花
      'v014', // 番茄
      'v015', // 黄瓜
      'f001', // 苹果
      'f003', // 香蕉
      'm007', // 鸡胸肉
      'm010', // 鸡蛋
      's004', // 鲈鱼
      's010', // 虾仁
      'b003', // 豆腐
      'd001', // 牛奶
      'd004', // 酸奶
      'n003', // 花生
      'n004', // 核桃
      'g009', // 红薯
      'v025', // 香菇
      'm004'  // 牛肉
    ];

    const foods = this.getFoodsByIds(popularFoodIds);
    return foods.slice(0, limit);
  }

  /**
   * 获取推荐食物
   * @param {string} goal - 健康目标 (lose/maintain/gain)
   * @param {number} limit - 数量限制
   * @returns {array} 推荐食物列表
   */
  getRecommendedFoods(goal = 'maintain', limit = 10) {
    const recommendations = {
      // 减重推荐：高蛋白、低热量、高纤维
      lose: [
        'v008', // 西兰花
        'v002', // 小白菜
        'v015', // 黄瓜
        'm007', // 鸡胸肉
        's004', // 鲈鱼
        's010', // 虾仁
        'b003', // 豆腐
        'v025', // 香菇
        'g006', // 燕麦
        'v003'  // 菠菜
      ],
      // 维持推荐：均衡营养
      maintain: [
        'g001', // 米饭
        'v008', // 西兰花
        'f001', // 苹果
        'm007', // 鸡胸肉
        'm010', // 鸡蛋
        's004', // 鲈鱼
        'b003', // 豆腐
        'd001', // 牛奶
        'g009', // 红薯
        'n003'  // 花生
      ],
      // 增重推荐：高热量、高蛋白
      gain: [
        'g002', // 大米
        'm004', // 牛肉
        'm007', // 鸡胸肉
        'n003', // 花生
        'n004', // 核桃
        'd001', // 牛奶
        'g006', // 燕麦
        'b003', // 豆腐
        'm010', // 鸡蛋
        'g011'  // 土豆
      ]
    };

    const foodIds = recommendations[goal] || recommendations.maintain;
    const foods = this.getFoodsByIds(foodIds);

    return foods.slice(0, limit);
  }

  /**
   * 获取低热量食物
   * @param {number} maxCalories - 最大热量
   * @param {number} limit - 数量限制
   * @returns {array} 低热量食物列表
   */
  getLowCalorieFoods(maxCalories = 50, limit = 20) {
    const allFoods = this.foodDatabase.getAllFoods();
    const lowCalorieFoods = allFoods
      .filter(food => food.calories <= maxCalories)
      .sort((a, b) => a.calories - b.calories);

    return lowCalorieFoods.slice(0, limit);
  }

  /**
   * 获取高蛋白食物
   * @param {number} minProtein - 最小蛋白质含量
   * @param {number} limit - 数量限制
   * @returns {array} 高蛋白食物列表
   */
  getHighProteinFoods(minProtein = 15, limit = 20) {
    const allFoods = this.foodDatabase.getAllFoods();
    const highProteinFoods = allFoods
      .filter(food => food.protein >= minProtein)
      .sort((a, b) => b.protein - a.protein);

    return highProteinFoods.slice(0, limit);
  }

  /**
   * 获取高纤维食物
   * @param {number} minFiber - 最小纤维含量
   * @param {number} limit - 数量限制
   * @returns {array} 高纤维食物列表
   */
  getHighFiberFoods(minFiber = 5, limit = 20) {
    const allFoods = this.foodDatabase.getAllFoods();
    const highFiberFoods = allFoods
      .filter(food => food.fiber >= minFiber)
      .sort((a, b) => b.fiber - a.fiber);

    return highFiberFoods.slice(0, limit);
  }

  /**
   * 根据餐型推荐食物
   * @param {string} mealType - 餐型 (breakfast/lunch/dinner/snack)
   * @param {number} limit - 数量限制
   * @returns {array} 推荐食物列表
   */
  getFoodsByMealType(mealType, limit = 10) {
    const mealRecommendations = {
      breakfast: [
        'g001', 'g006', 'g008', 'm010', 'd001',
        'd004', 'f001', 'f003', 'f009', 'g009'
      ],
      lunch: [
        'g001', 'm007', 'm004', 's004', 's010',
        'b003', 'v008', 'v002', 'v014', 'v015'
      ],
      dinner: [
        's004', 's010', 'v002', 'v008', 'v015',
        'b003', 'v014', 'v021', 'v005', 'v027'
      ],
      snack: [
        'f001', 'f003', 'f009', 'n003', 'n004',
        'd004', 'g009', 'v015', 'f010', 'b008'
      ]
    };

    const foodIds = mealRecommendations[mealType] || [];
    const foods = this.getFoodsByIds(foodIds);

    return foods.slice(0, limit);
  }

  /**
   * 计算食物组合的总营养
   * @param {array} foodItems - 食物项数组 [{foodId, amount}, ...]
   * @returns {object} 总营养信息
   */
  calculateMealNutrition(foodItems) {
    let total = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    };

    const items = foodItems.map(item => {
      const food = this.getFoodById(item.foodId);
      if (!food) {
        return null;
      }

      const nutrition = calculateFoodNutrition(food, item.amount);

      total.calories += nutrition.calories;
      total.protein += nutrition.protein;
      total.carbs += nutrition.carbs;
      total.fat += nutrition.fat;
      total.fiber += nutrition.fiber;

      return {
        food: food,
        amount: item.amount,
        nutrition: nutrition
      };
    }).filter(item => item !== null);

    // 四舍五入
    total.protein = Math.round(total.protein * 10) / 10;
    total.carbs = Math.round(total.carbs * 10) / 10;
    total.fat = Math.round(total.fat * 10) / 10;
    total.fiber = Math.round(total.fiber * 10) / 10;

    return {
      items,
      total
    };
  }

  /**
   * 分析食物营养价值
   * @param {object} food - 食物对象
   * @returns {object} 分析结果
   */
  analyzeFoodValue(food) {
    const analysis = {
      features: [],
      pros: [],
      cons: []
    };

    // 热量分析
    if (food.calories <= 50) {
      analysis.features.push('低热量');
      analysis.pros.push('热量低，适合减脂期食用');
    } else if (food.calories >= 400) {
      analysis.features.push('高热量');
      analysis.cons.push('热量较高，需要控制食用量');
    }

    // 蛋白质分析
    if (food.protein >= 20) {
      analysis.features.push('高蛋白');
      analysis.pros.push('优质蛋白质来源，有助于肌肉生长');
    }

    // 脂肪分析
    if (food.fat <= 3) {
      analysis.features.push('低脂');
      analysis.pros.push('脂肪含量低，适合控制脂肪摄入');
    } else if (food.fat >= 20) {
      analysis.features.push('高脂');
      if (food.category === 'nuts' || food.category === 'fats') {
        analysis.pros.push('含有健康脂肪，适量食用有益');
      } else {
        analysis.cons.push('脂肪含量高，建议适量食用');
      }
    }

    // 碳水化合物分析
    if (food.carbs <= 5) {
      analysis.features.push('低碳水');
      analysis.pros.push('碳水化合物含量低');
    }

    // 膳食纤维分析
    if (food.fiber >= 5) {
      analysis.features.push('高纤维');
      analysis.pros.push('膳食纤维丰富，有助于消化');
    } else if (food.fiber === 0 && food.category === 'vegetables') {
      analysis.cons.push('膳食纤维含量较低');
    }

    // 特定营养素分析
    if (food.category === 'dairy' && food.protein >= 3) {
      analysis.pros.push('富含钙质，有益骨骼健康');
    }

    if (food.category === 'seafood') {
      analysis.pros.push('含有优质蛋白和不饱和脂肪酸');
    }

    return analysis;
  }

  /**
   * 获取食物替换建议
   * @param {object} food - 食物对象
   * @returns {array} 替换食物列表
   */
  getFoodAlternatives(food) {
    const alternatives = {
      // 主食类
      'g001': ['g006', 'g009', 'g010', 'g011'], // 米饭 -> 燕麦、红薯、紫薯、土豆
      'g008': ['g007', 'g006', 'g009'],         // 馒头 -> 全麦面包、燕麦、红薯

      // 肉类
      'm001': ['m007', 'm004', 's004'],         // 猪肉 -> 鸡胸肉、牛肉、鲈鱼
      'm002': ['m007', 'm004', 's010'],         // 五花肉 -> 鸡胸肉、牛肉、虾仁

      // 蔬菜
      'v014': ['v021', 'v015', 'v008'],         // 番茄 -> 苦瓜、黄瓜、西兰花
      'v011': ['v012', 'v015', 'v005'],         // 胡萝卜 -> 白萝卜、黄瓜、生菜

      // 水果
      'f003': ['f009', 'f001', 'f010'],         // 香蕉 -> 草莓、苹果、猕猴桃
      'f019': ['f012', 'f009', 'f013']          // 榴莲 -> 菠萝、草莓、西瓜
    };

    const alternativeIds = alternatives[food.id] || [];

    // 如果没有预定义的替换，按类别和营养特征找相似食物
    if (alternativeIds.length === 0) {
      const similarFoods = this.getFoodsByCategory(food.category)
        .filter(f => f.id !== food.id)
        .filter(f => {
          // 热量相差不超过30%
          const calorieDiff = Math.abs(f.calories - food.calories) / food.calories;
          return calorieDiff <= 0.3;
        })
        .slice(0, 4)
        .map(f => f.id);

      return this.getFoodsByIds(similarFoods);
    }

    return this.getFoodsByIds(alternativeIds);
  }

  /**
   * 获取食物份量建议
   * @param {object} food - 食物对象
   * @param {number} dailyTarget - 每日热量目标
   * @param {string} mealType - 餐型
   * @returns {object} 份量建议
   */
  getPortionSuggestion(food, dailyTarget = 2000, mealType = 'lunch') {
    // 计算每餐热量分配
    const mealRatios = {
      breakfast: 0.25,
      lunch: 0.40,
      dinner: 0.30,
      snack: 0.05
    };

    const mealCalorieTarget = dailyTarget * (mealRatios[mealType] || 0.33);

    // 假设该食物占该餐的20%-40%
    const foodCalorieTarget = mealCalorieTarget * 0.3;

    // 计算建议份量
    let suggestedAmount = 100;
    if (food.calories > 0) {
      suggestedAmount = Math.round((foodCalorieTarget / food.calories) * 100);
    }

    // 限制份量范围
    suggestedAmount = Math.max(30, Math.min(500, suggestedAmount));

    // 计算实际热量
    const actualCalories = Math.round((suggestedAmount / 100) * food.calories);

    // 份量描述
    let portionDescription;
    if (suggestedAmount <= 50) {
      portionDescription = '少量';
    } else if (suggestedAmount <= 100) {
      portionDescription = '适量';
    } else if (suggestedAmount <= 200) {
      portionDescription = '较大量';
    } else {
      portionDescription = '大量';
    }

    return {
      suggestedAmount,
      actualCalories,
      percentage: calculateCaloriePercentage(actualCalories, dailyTarget),
      description: portionDescription,
      unit: food.unit || 'g'
    };
  }

  /**
   * 获取食物统计信息
   * @returns {object} 统计信息
   */
  getFoodStats() {
    const allFoods = this.foodDatabase.getAllFoods();

    // 按分类统计
    const categoryStats = {};
    for (const cat in FOOD_CATEGORIES) {
      const foods = this.foodDatabase.getFoodsByCategory(FOOD_CATEGORIES[cat]);
      if (foods) {
        categoryStats[FOOD_CATEGORIES[cat]] = foods.length;
      }
    }

    // 营养统计
    const avgCalories = allFoods.reduce((sum, f) => sum + f.calories, 0) / allFoods.length;
    const avgProtein = allFoods.reduce((sum, f) => sum + f.protein, 0) / allFoods.length;
    const avgCarbs = allFoods.reduce((sum, f) => sum + f.carbs, 0) / allFoods.length;
    const avgFat = allFoods.reduce((sum, f) => sum + f.fat, 0) / allFoods.length;

    return {
      totalFoods: allFoods.length,
      categoryStats,
      averages: {
        calories: Math.round(avgCalories),
        protein: Math.round(avgProtein * 10) / 10,
        carbs: Math.round(avgCarbs * 10) / 10,
        fat: Math.round(avgFat * 10) / 10
      }
    };
  }
}

// 导出单例
module.exports = new FoodService();

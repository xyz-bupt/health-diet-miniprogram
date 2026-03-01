/**
 * nutrition-service.js - 营养计算服务
 * 提供营养相关的计算和分析功能
 */

import {
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  calculateCalorieTarget,
  calculateMacros,
  calculateFoodNutrition,
  calculateTotalNutrition,
  calculatePercentage,
  getNutritionStatus,
  getBMICategory,
  calculateIdealWeightRange,
  calculateWeightLossTime,
  calculateWeightGainTime,
  calculateWaterIntake,
  calculateMealDistribution,
  calculateHealthScore
} from '../utils/nutrition-calculator.js';

import { ACTIVITY_MULTIPLIERS, MACRO_RATIOS, NUTRIENT_CONVERSION } from '../utils/constants.js';

/**
 * 营养服务类
 */
class NutritionService {
  /**
   * 计算完整的营养指标
   * @param {object} profile - 用户档案
   * @returns {object} 计算结果
   */
  calculateNutritionMetrics(profile) {
    const { gender, weight, height, age, activityLevel, goal } = profile;

    // 计算BMI
    const bmi = calculateBMI(height, weight);
    const bmiCategory = getBMICategory(bmi);

    // 计算BMR
    const bmr = calculateBMR(gender, weight, height, age);

    // 计算TDEE
    const tdee = calculateTDEE(bmr, activityLevel);

    // 计算每日卡路里目标
    const dailyCalorieTarget = calculateCalorieTarget(tdee, goal);

    // 计算宏量营养素目标
    const macroTargets = calculateMacros(dailyCalorieTarget, goal);

    // 计算理想体重范围
    const idealWeightRange = calculateIdealWeightRange(height);

    // 计算每日水分需求
    const dailyWaterIntake = calculateWaterIntake(weight, activityLevel);

    // 计算餐次热量分配
    const mealDistribution = calculateMealDistribution(dailyCalorieTarget);

    return {
      bmi,
      bmiCategory,
      bmr,
      tdee,
      dailyCalorieTarget,
      macroTargets,
      idealWeightRange,
      dailyWaterIntake,
      mealDistribution,
      activityMultiplier: ACTIVITY_MULTIPLIERS[activityLevel] || 1.2
    };
  }

  /**
   * 分析今日营养摄入
   * @param {object} todayNutrition - 今日营养数据
   * @param {object} targets - 营养目标
   * @returns {object} 分析结果
   */
  analyzeTodayNutrition(todayNutrition, targets) {
    const total = todayNutrition.total || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

    // 计算各项营养完成情况
    const calories = getNutritionStatus(total.calories, targets.calories);
    const protein = getNutritionStatus(total.protein, targets.protein);
    const carbs = getNutritionStatus(total.carbs, targets.carbs);
    const fat = getNutritionStatus(total.fat, targets.fat);
    const fiber = getNutritionStatus(total.fiber, targets.fiber);

    // 计算健康评分
    const healthScore = calculateHealthScore(total, targets);

    // 计算剩余可摄入热量
    const remainingCalories = targets.calories - total.calories;

    // 计算热量来源分布
    const calorieDistribution = this.calculateCalorieDistribution(total);

    return {
      nutrients: {
        calories,
        protein,
        carbs,
        fat,
        fiber
      },
      healthScore,
      remainingCalories,
      calorieDistribution,
      summary: this.getNutritionSummary(total, targets)
    };
  }

  /**
   * 计算热量来源分布
   * @param {object} total - 总营养摄入
   * @returns {object} 热量分布
   */
  calculateCalorieDistribution(total) {
    const proteinCalories = total.protein * NUTRIENT_CONVERSION.protein;
    const carbsCalories = total.carbs * NUTRIENT_CONVERSION.carbs;
    const fatCalories = total.fat * NUTRIENT_CONVERSION.fat;
    const totalCalories = total.calories || 1;

    return {
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
  }

  /**
   * 获取营养摄入总结
   * @param {object} total - 总营养摄入
   * @param {object} targets - 营养目标
   * @returns {string} 总结文本
   */
  getNutritionSummary(total, targets) {
    const caloriePercent = calculatePercentage(total.calories, targets.calories);

    if (caloriePercent >= 100) {
      return '今日热量已达标，注意不要再过度摄入';
    } else if (caloriePercent >= 80) {
      return '今日热量摄入接近目标，合理控制剩余餐食';
    } else if (caloriePercent >= 50) {
      return '今日热量摄入适中，继续保持均衡饮食';
    } else {
      return '今日热量摄入不足，还需要增加营养';
    }
  }

  /**
   * 分析食物营养
   * @param {object} food - 食物对象
   * @param {number} amount - 食用量
   * @returns {object} 分析结果
   */
  analyzeFoodNutrition(food, amount) {
    const nutrition = calculateFoodNutrition(food, amount);

    // 计算营养密度
    const nutrientDensity = this.calculateNutrientDensity(food);

    // 获取食物营养特点
    const features = this.getFoodNutritionFeatures(food);

    return {
      ...nutrition,
      nutrientDensity,
      features
    };
  }

  /**
   * 计算营养密度
   * @param {object} food - 食物对象
   * @returns {string} 营养密度等级
   */
  calculateNutrientDensity(food) {
    const score = (food.protein || 0) + (food.fiber || 0) * 2 - (food.fat || 0) * 0.5;

    if (score >= 15) {
      return 'high';
    } else if (score >= 8) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * 获取食物营养特点
   * @param {object} food - 食物对象
   * @returns {array} 特点标签
   */
  getFoodNutritionFeatures(food) {
    const features = [];
    const { calories, protein, carbs, fat, fiber } = food;

    // 热量特点
    if (calories <= 50) {
      features.push('低热量');
    } else if (calories >= 400) {
      features.push('高热量');
    }

    // 蛋白质特点
    if (protein >= 20) {
      features.push('高蛋白');
    }

    // 脂肪特点
    if (fat <= 3) {
      features.push('低脂');
    } else if (fat >= 20) {
      features.push('高脂');
    }

    // 膳食纤维特点
    if (fiber >= 5) {
      features.push('高纤维');
    }

    // 碳水化合物特点
    if (carbs <= 5) {
      features.push('低碳水');
    }

    return features;
  }

  /**
   * 推荐每日营养计划
   * @param {object} profile - 用户档案
   * @param {object} todayNutrition - 今日已摄入营养
   * @returns {object} 推荐计划
   */
  recommendDailyPlan(profile, todayNutrition) {
    const metrics = this.calculateNutritionMetrics(profile);
    const total = todayNutrition.total || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

    // 计算剩余营养目标
    const remaining = {
      calories: metrics.dailyCalorieTarget - total.calories,
      protein: metrics.macroTargets.protein - total.protein,
      carbs: metrics.macroTargets.carbs - total.carbs,
      fat: metrics.macroTargets.fat - total.fat,
      fiber: 25 - total.fiber
    };

    // 根据剩余热量推荐食物
    const foodRecommendations = this.recommendFoodsByCalories(remaining.calories, profile.goal);

    // 营养建议
    const nutritionAdvice = this.getNutritionAdvice(total, metrics.macroTargets, profile.goal);

    return {
      remaining,
      mealDistribution: metrics.mealDistribution,
      foodRecommendations,
      nutritionAdvice
    };
  }

  /**
   * 根据剩余热量推荐食物
   * @param {number} remainingCalories - 剩余热量
   * @param {string} goal - 健康目标
   * @returns {array} 推荐食物分类
   */
  recommendFoodsByCalories(remainingCalories, goal) {
    if (remainingCalories <= 0) {
      return [{
        category: 'warning',
        message: '今日热量已达标，建议只摄入低热量蔬菜',
        foods: ['黄瓜', '番茄', '生菜', '冬瓜']
      }];
    }

    const recommendations = [];

    // 根据目标调整推荐
    if (goal === 'lose') {
      recommendations.push({
        category: 'protein',
        message: '建议选择高蛋白低脂食物',
        foods: ['鸡胸肉', '鱼肉', '虾仁', '豆腐']
      });
    } else if (goal === 'gain') {
      recommendations.push({
        category: 'carbs',
        message: '可以适当增加优质碳水摄入',
        foods: ['米饭', '燕麦', '红薯', '全麦面包']
      });
    }

    // 通用推荐
    recommendations.push({
      category: 'vegetables',
      message: '增加蔬菜摄入，补充维生素和纤维',
      foods: ['西兰花', '菠菜', '胡萝卜', '番茄']
    });

    return recommendations;
  }

  /**
   * 获取营养建议
   * @param {object} total - 已摄入营养
   * @param {object} targets - 营养目标
   * @param {string} goal - 健康目标
   * @returns {array} 建议列表
   */
  getNutritionAdvice(total, targets, goal) {
    const advice = [];
    const proteinPercent = calculatePercentage(total.protein, targets.protein);
    const carbsPercent = calculatePercentage(total.carbs, targets.carbs);
    const fatPercent = calculatePercentage(total.fat, targets.fat);
    const fiberPercent = calculatePercentage(total.fiber, 25);

    // 蛋白质建议
    if (proteinPercent < 50) {
      advice.push('蛋白质摄入不足，建议增加肉类、蛋类、豆制品摄入');
    }

    // 碳水化合物建议
    if (carbsPercent < 50 && goal !== 'lose') {
      advice.push('碳水化合物摄入不足，可以适当增加主食');
    } else if (carbsPercent > 100 && goal === 'lose') {
      advice.push('碳水化合物摄入过多，建议减少精制主食，增加粗粮');
    }

    // 脂肪建议
    if (fatPercent > 100) {
      advice.push('脂肪摄入已超标，后续饮食选择低脂食物');
    }

    // 膳食纤维建议
    if (fiberPercent < 50) {
      advice.push('膳食纤维摄入不足，建议多吃蔬菜、水果和全谷物');
    }

    if (advice.length === 0) {
      advice.push('今日营养摄入均衡，继续保持！');
    }

    return advice;
  }

  /**
   * 预测体重变化趋势
   * @param {object} profile - 用户档案
   * @param {number} days - 预测天数
   * @returns {object} 预测结果
   */
  predictWeightChange(profile, days = 30) {
    const metrics = this.calculateNutritionMetrics(profile);
    const { goal, weight, targetWeight } = profile;

    let predictedWeight = weight;
    let weeklyChange = 0;

    if (goal === 'lose') {
      // 减重：每周约0.5-1kg
      weeklyChange = -0.7;
    } else if (goal === 'gain') {
      // 增重：每周约0.3-0.5kg
      weeklyChange = 0.4;
    }

    const totalChange = (days / 7) * weeklyChange;
    predictedWeight = weight + totalChange;

    // 计算达到目标体重所需时间
    let timeToGoal = null;
    if (goal === 'lose' && targetWeight < weight) {
      const weightToLose = weight - targetWeight;
      timeToGoal = Math.ceil((weightToLose / Math.abs(weeklyChange)) * 7);
    } else if (goal === 'gain' && targetWeight > weight) {
      const weightToGain = targetWeight - weight;
      timeToGoal = Math.ceil((weightToGain / Math.abs(weeklyChange)) * 7);
    }

    return {
      currentWeight: weight,
      predictedWeight: Math.round(predictedWeight * 10) / 10,
      totalChange: Math.round(Math.abs(totalChange) * 10) / 10,
      weeklyChange: Math.abs(weeklyChange),
      timeToGoal,
      goal
    };
  }

  /**
   * 生成营养报告
   * @param {object} profile - 用户档案
   * @param {object} todayNutrition - 今日营养数据
   * @param {array} weekHistory - 本周历史数据
   * @returns {object} 营养报告
   */
  generateNutritionReport(profile, todayNutrition, weekHistory = []) {
    const metrics = this.calculateNutritionMetrics(profile);
    const analysis = this.analyzeTodayNutrition(todayNutrition, {
      calories: metrics.dailyCalorieTarget,
      protein: metrics.macroTargets.protein,
      carbs: metrics.macroTargets.carbs,
      fat: metrics.macroTargets.fat,
      fiber: 25
    });

    // 本周平均摄入
    const weekAverage = this.calculateWeekAverage(weekHistory);

    // 生成建议
    const recommendations = this.generateRecommendations(analysis, weekAverage, profile.goal);

    return {
      date: new Date().toISOString(),
      profile: {
        bmi: metrics.bmi,
        bmiCategory: metrics.bmiCategory.name,
        goal: profile.goal,
        targetWeight: profile.targetWeight
      },
      today: {
        intake: todayNutrition.total,
        targets: {
          calories: metrics.dailyCalorieTarget,
          ...metrics.macroTargets
        },
        status: analysis.nutrients,
        healthScore: analysis.healthScore
      },
      weekAverage,
      recommendations
    };
  }

  /**
   * 计算本周平均摄入
   * @param {array} weekHistory - 本周历史数据
   * @returns {object} 平均值
   */
  calculateWeekAverage(weekHistory) {
    if (!weekHistory || weekHistory.length === 0) {
      return null;
    }

    const sum = weekHistory.reduce((acc, day) => {
      return {
        calories: acc.calories + (day.total?.calories || 0),
        protein: acc.protein + (day.total?.protein || 0),
        carbs: acc.carbs + (day.total?.carbs || 0),
        fat: acc.fat + (day.total?.fat || 0),
        fiber: acc.fiber + (day.total?.fiber || 0)
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

    const days = weekHistory.length;

    return {
      calories: Math.round(sum.calories / days),
      protein: Math.round((sum.protein / days) * 10) / 10,
      carbs: Math.round((sum.carbs / days) * 10) / 10,
      fat: Math.round((sum.fat / days) * 10) / 10,
      fiber: Math.round((sum.fiber / days) * 10) / 10
    };
  }

  /**
   * 生成营养建议
   * @param {object} analysis - 今日分析
   * @param {object} weekAverage - 本周平均
   * @param {string} goal - 健康目标
   * @returns {array} 建议列表
   */
  generateRecommendations(analysis, weekAverage, goal) {
    const recommendations = [];
    const { nutrients, healthScore } = analysis;

    // 基于健康评分的建议
    if (healthScore.score >= 90) {
      recommendations.push({
        type: 'success',
        title: '饮食均衡',
        content: '您的饮食非常健康，继续保持！'
      });
    } else if (healthScore.score >= 60) {
      recommendations.push({
        type: 'info',
        title: '仍有提升空间',
        content: '整体不错，可以进一步优化营养搭配'
      });
    } else {
      recommendations.push({
        type: 'warning',
        title: '需要改善',
        content: '建议调整饮食结构，咨询营养师获取专业建议'
      });
    }

    // 基于目标的具体建议
    if (goal === 'lose' && nutrients.calories.percentage > 90) {
      recommendations.push({
        type: 'warning',
        title: '热量提醒',
        content: '今日热量接近目标，建议控制后续餐食'
      });
    } else if (goal === 'gain' && nutrients.calories.percentage < 70) {
      recommendations.push({
        type: 'info',
        title: '热量不足',
        content: '今日热量摄入不足，需要增加健康食物摄入'
      });
    }

    // 蛋白质建议
    if (nutrients.protein.percentage < 50) {
      recommendations.push({
        type: 'warning',
        title: '蛋白质不足',
        content: '建议增加优质蛋白质摄入，如鱼、肉、蛋、奶'
      });
    }

    return recommendations;
  }
}

// 导出单例
export default new NutritionService();

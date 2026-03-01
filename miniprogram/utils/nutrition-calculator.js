/**
 * nutrition-calculator.js - 营养计算工具类
 * 提供各种营养指标的计算功能
 *
 * 修复说明：
 * - 转换为 CommonJS 格式以兼容微信小程序
 * - 使用 require 和 module.exports
 */

const { ACTIVITY_MULTIPLIERS, CALORIE_ADJUSTMENT, MACRO_RATIOS, NUTRIENT_CONVERSION } = require('./constants.js');

/**
 * 计算BMI (身体质量指数)
 * @param {number} height - 身高 (cm)
 * @param {number} weight - 体重 (kg)
 * @returns {number} BMI值
 */
function calculateBMI(height, weight) {
  if (!height || !weight || height <= 0 || weight <= 0) {
    return 0;
  }
  const heightInMeters = height / 100;
  return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

/**
 * 获取BMI分类
 * @param {number} bmi - BMI值
 * @returns {object} BMI分类信息
 */
function getBMICategory(bmi) {
  if (bmi < 18.5) {
    return {
      category: 'underweight',
      name: '偏瘦',
      color: '#FF9800',
      advice: '建议适当增加营养摄入，多吃优质蛋白质和健康脂肪'
    };
  } else if (bmi < 24) {
    return {
      category: 'normal',
      name: '正常',
      color: '#4CAF50',
      advice: '保持当前饮食习惯和生活方式，继续保持'
    };
  } else if (bmi < 28) {
    return {
      category: 'overweight',
      name: '超重',
      color: '#FFC107',
      advice: '建议控制饮食总热量，增加运动量，逐步减重'
    };
  } else {
    return {
      category: 'obese',
      name: '肥胖',
      color: '#F44336',
      advice: '建议咨询营养师或医生，制定科学的减重计划'
    };
  }
}

/**
 * 计算BMR (基础代谢率) - 使用Mifflin-St Jeor公式
 * @param {string} gender - 性别 (male/female)
 * @param {number} weight - 体重 (kg)
 * @param {number} height - 身高 (cm)
 * @param {number} age - 年龄
 * @returns {number} BMR值 (kcal/day)
 */
function calculateBMR(gender, weight, height, age) {
  if (!weight || !height || !age) {
    return 0;
  }

  let bmr;
  if (gender === 'male') {
    // 男性: BMR = 10 × 体重kg + 6.25 × 身高cm - 5 × 年龄 + 5
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    // 女性: BMR = 10 × 体重kg + 6.25 × 身高cm - 5 × 年龄 - 161
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  return Math.round(bmr);
}

/**
 * 计算TDEE (每日总能量消耗)
 * @param {number} bmr - 基础代谢率
 * @param {string} activityLevel - 活动水平 (sedentary/light/moderate/activity)
 * @returns {number} TDEE值 (kcal/day)
 */
function calculateTDEE(bmr, activityLevel) {
  if (!bmr || !activityLevel) {
    return 0;
  }

  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.2;
  return Math.round(bmr * multiplier);
}

/**
 * 根据目标计算每日卡路里目标
 * @param {number} tdee - 每日总能量消耗
 * @param {string} goal - 健康目标 (lose/maintain/gain)
 * @returns {number} 每日卡路里目标
 */
function calculateCalorieTarget(tdee, goal) {
  if (!tdee || !goal) {
    return 2000; // 默认值
  }

  const adjustment = CALORIE_ADJUSTMENT[goal] || 0;
  return Math.round(tdee + adjustment);
}

/**
 * 计算宏量营养素目标
 * @param {number} calorieTarget - 每日卡路里目标
 * @param {string} goal - 健康目标
 * @returns {object} 宏量营养素目标 (g)
 */
function calculateMacros(calorieTarget, goal) {
  if (!calorieTarget) {
    return { protein: 100, carbs: 250, fat: 65 };
  }

  // 获取对应目标的宏量营养素比例
  const ratios = MACRO_RATIOS[goal] || MACRO_RATIOS.maintain;

  // 计算各营养素提供的热量
  const proteinCalories = calorieTarget * ratios.protein;
  const carbsCalories = calorieTarget * ratios.carbs;
  const fatCalories = calorieTarget * ratios.fat;

  // 转换为克数
  return {
    protein: Math.round(proteinCalories / NUTRIENT_CONVERSION.protein),
    carbs: Math.round(carbsCalories / NUTRIENT_CONVERSION.carbs),
    fat: Math.round(fatCalories / NUTRIENT_CONVERSION.fat)
  };
}

/**
 * 计算食物的营养含量
 * @param {object} food - 食物对象 (每100g含量)
 * @param {number} amount - 食用量 (g)
 * @returns {object} 计算后的营养含量
 */
function calculateFoodNutrition(food, amount) {
  if (!food || !amount || amount <= 0) {
    return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  }

  const factor = amount / 100;

  return {
    calories: Math.round(food.calories * factor),
    protein: Math.round(food.protein * factor * 10) / 10,
    carbs: Math.round(food.carbs * factor * 10) / 10,
    fat: Math.round(food.fat * factor * 10) / 10,
    fiber: Math.round(food.fiber * factor * 10) / 10
  };
}

/**
 * 计算多食物的总营养
 * @param {array} foods - 食物数组 (每个包含nutrition对象)
 * @returns {object} 总营养含量
 */
function calculateTotalNutrition(foods) {
  if (!foods || foods.length === 0) {
    return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  }

  return foods.reduce((total, food) => {
    return {
      calories: total.calories + (food.calories || 0),
      protein: Math.round((total.protein + (food.protein || 0)) * 10) / 10,
      carbs: Math.round((total.carbs + (food.carbs || 0)) * 10) / 10,
      fat: Math.round((total.fat + (food.fat || 0)) * 10) / 10,
      fiber: Math.round((total.fiber + (food.fiber || 0)) * 10) / 10
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
}

/**
 * 计算营养完成百分比
 * @param {number} current - 当前摄入量
 * @param {number} target - 目标量
 * @returns {number} 百分比 (0-100)
 */
function calculatePercentage(current, target) {
  if (!target || target <= 0) {
    return 0;
  }

  const percentage = (current / target) * 100;
  return Math.min(Math.max(Math.round(percentage), 0), 150); // 限制在0-150%
}

/**
 * 获取营养状态
 * @param {number} current - 当前摄入量
 * @param {number} target - 目标量
 * @returns {object} 状态信息
 */
function getNutritionStatus(current, target) {
  const percentage = calculatePercentage(current, target);

  if (percentage >= 100) {
    return {
      status: 'completed',
      text: '已达标',
      color: '#4CAF50',
      percentage: percentage
    };
  } else if (percentage >= 80) {
    return {
      status: 'near',
      text: '接近目标',
      color: '#FF9800',
      percentage: percentage
    };
  } else if (percentage >= 50) {
    return {
      status: 'progress',
      text: '进行中',
      color: '#2196F3',
      percentage: percentage
    };
  } else {
    return {
      status: 'low',
      text: '摄入不足',
      color: '#9E9E9E',
      percentage: percentage
    };
  }
}

/**
 * 计算理想体重范围 (基于BMI 18.5-24)
 * @param {number} height - 身高 (cm)
 * @returns {object} 理想体重范围
 */
function calculateIdealWeightRange(height) {
  if (!height || height <= 0) {
    return { min: 0, max: 0 };
  }

  const heightInMeters = height / 100;
  const minWeight = Math.round(18.5 * heightInMeters * heightInMeters);
  const maxWeight = Math.round(24 * heightInMeters * heightInMeters);

  return { min: minWeight, max: maxWeight };
}

/**
 * 计算减重所需时间
 * @param {number} currentWeight - 当前体重 (kg)
 * @param {number} targetWeight - 目标体重 (kg)
 * @param {number} dailyCalorieDeficit - 每日热量缺口 (kcal)
 * @returns {object} 预计时间和所需总热量缺口
 */
function calculateWeightLossTime(currentWeight, targetWeight, dailyCalorieDeficit = 500) {
  if (!currentWeight || !targetWeight || currentWeight <= targetWeight) {
    return { weeks: 0, totalDeficit: 0 };
  }

  // 减重1kg约需要7700kcal热量缺口
  const weightToLose = currentWeight - targetWeight;
  const totalDeficit = Math.round(weightToLose * 7700);
  const days = Math.ceil(totalDeficit / dailyCalorieDeficit);
  const weeks = Math.ceil(days / 7);

  return {
    weeks: weeks,
    days: days,
    totalDeficit: totalDeficit,
    weightToLose: weightToLose
  };
}

/**
 * 计算增重所需时间
 * @param {number} currentWeight - 当前体重 (kg)
 * @param {number} targetWeight - 目标体重 (kg)
 * @param {number} dailyCalorieSurplus - 每日热量盈余 (kcal)
 * @returns {object} 预计时间和所需总热量盈余
 */
function calculateWeightGainTime(currentWeight, targetWeight, dailyCalorieSurplus = 300) {
  if (!currentWeight || !targetWeight || currentWeight >= targetWeight) {
    return { weeks: 0, totalSurplus: 0 };
  }

  // 增重1kg约需要5500kcal热量盈余 (考虑部分是肌肉)
  const weightToGain = targetWeight - currentWeight;
  const totalSurplus = Math.round(weightToGain * 5500);
  const days = Math.ceil(totalSurplus / dailyCalorieSurplus);
  const weeks = Math.ceil(days / 7);

  return {
    weeks: weeks,
    days: days,
    totalSurplus: totalSurplus,
    weightToGain: weightToGain
  };
}

/**
 * 计算水分需求量
 * @param {number} weight - 体重 (kg)
 * @param {string} activityLevel - 活动水平
 * @returns {number} 每日水分需求 (ml)
 */
function calculateWaterIntake(weight, activityLevel) {
  if (!weight) {
    return 2000; // 默认值
  }

  // 基础需求: 体重kg × 33ml
  let waterIntake = weight * 33;

  // 根据活动水平调整
  if (activityLevel === 'activity') {
    waterIntake *= 1.3;
  } else if (activityLevel === 'moderate') {
    waterIntake *= 1.1;
  }

  return Math.round(waterIntake);
}

/**
 * 计算餐次热量分配
 * @param {number} totalCalories - 每日总热量
 * @returns {object} 各餐次热量分配
 */
function calculateMealDistribution(totalCalories) {
  if (!totalCalories) {
    return {
      breakfast: 500,
      lunch: 800,
      dinner: 600,
      snack: 100
    };
  }

  return {
    breakfast: Math.round(totalCalories * 0.25),
    lunch: Math.round(totalCalories * 0.40),
    dinner: Math.round(totalCalories * 0.30),
    snack: Math.round(totalCalories * 0.05)
  };
}

/**
 * 计算食物份量
 * @param {number} calories - 目标热量
 * @param {number} foodCaloriesPer100g - 食物每100g热量
 * @returns {number} 建议份量 (g)
 */
function calculatePortion(calories, foodCaloriesPer100g) {
  if (!calories || !foodCaloriesPer100g) {
    return 100;
  }

  return Math.round((calories / foodCaloriesPer100g) * 100);
}

/**
 * 计算营养密度
 * @param {object} nutrition - 营养成分
 * @param {number} calories - 热量
 * @returns {number} 营养密度分数
 */
function calculateNutrientDensity(nutrition, calories) {
  if (!nutrition || !calories || calories <= 0) {
    return 0;
  }

  // 简化计算: (蛋白质 + 膳食纤维×2) / 热量 × 100
  const score = ((nutrition.protein || 0) + (nutrition.fiber || 0) * 2) / calories * 100;

  return Math.round(score * 10) / 10;
}

/**
 * 计算健康评分
 * @param {object} todayNutrition - 今日营养摄入
 * @param {object} targets - 营养目标
 * @returns {object} 健康评分和评价
 */
function calculateHealthScore(todayNutrition, targets) {
  if (!todayNutrition || !targets) {
    return { score: 0, level: 'unknown', advice: '数据不足' };
  }

  // 计算各项得分
  const calorieScore = calculateScore(todayNutrition.calories, targets.calories, 0.9, 1.1);
  const proteinScore = calculateScore(todayNutrition.protein, targets.protein, 0.8, 1.2);
  const carbsScore = calculateScore(todayNutrition.carbs, targets.carbs, 0.8, 1.2);
  const fatScore = calculateScore(todayNutrition.fat, targets.fat, 0.8, 1.2);
  const fiberScore = calculateScore(todayNutrition.fiber, targets.fiber, 0.7, 100);

  // 综合得分 (权重分配)
  const totalScore = Math.round(
    calorieScore * 0.25 +
    proteinScore * 0.25 +
    carbsScore * 0.2 +
    fatScore * 0.15 +
    fiberScore * 0.15
  );

  // 评价等级
  let level, advice, color;

  if (totalScore >= 90) {
    level = 'excellent';
    advice = '营养均衡，继续保持！';
    color = '#4CAF50';
  } else if (totalScore >= 75) {
    level = 'good';
    advice = '整体不错，可以再优化一下';
    color = '#8BC34A';
  } else if (totalScore >= 60) {
    level = 'fair';
    advice = '还需努力，注意营养搭配';
    color = '#FF9800';
  } else {
    level = 'poor';
    advice = '建议咨询营养师调整饮食';
    color = '#F44336';
  }

  return {
    score: totalScore,
    level: level,
    advice: advice,
    color: color
  };
}

/**
 * 计算单项得分
 * @param {number} current - 当前值
 * @param {number} target - 目标值
 * @param {number} minRatio - 最小比例
 * @param {number} maxRatio - 最大比例
 * @returns {number} 得分 (0-100)
 */
function calculateScore(current, target, minRatio, maxRatio) {
  if (!target || target <= 0) {
    return 0;
  }

  const ratio = current / target;

  if (ratio >= minRatio && ratio <= maxRatio) {
    return 100;
  } else if (ratio < minRatio) {
    return Math.round((ratio / minRatio) * 100);
  } else {
    return Math.max(0, Math.round(100 - (ratio - maxRatio) * 50));
  }
}

/**
 * 格式化营养值显示
 * @param {number} value - 营养值
 * @param {string} unit - 单位
 * @returns {string} 格式化后的字符串
 */
function formatNutrition(value, unit = 'g') {
  if (value === null || value === undefined) {
    return `0${unit}`;
  }

  if (unit === 'g') {
    return `${Math.round(value * 10) / 10}${unit}`;
  }

  return `${Math.round(value)}${unit}`;
}

/**
 * 计算食物热量占比
 * @param {number} foodCalories - 食物热量
 * @param {number} dailyTarget - 每日目标
 * @returns {number} 百分比
 */
function calculateCaloriePercentage(foodCalories, dailyTarget) {
  if (!foodCalories || !dailyTarget || dailyTarget <= 0) {
    return 0;
  }
  return Math.round((foodCalories / dailyTarget) * 100);
}

// 导出所有函数
module.exports = {
  calculateBMI,
  getBMICategory,
  calculateBMR,
  calculateTDEE,
  calculateCalorieTarget,
  calculateMacros,
  calculateFoodNutrition,
  calculateTotalNutrition,
  calculatePercentage,
  getNutritionStatus,
  calculateIdealWeightRange,
  calculateWeightLossTime,
  calculateWeightGainTime,
  calculateWaterIntake,
  calculateMealDistribution,
  calculatePortion,
  calculateNutrientDensity,
  calculateHealthScore,
  formatNutrition,
  calculateCaloriePercentage
};

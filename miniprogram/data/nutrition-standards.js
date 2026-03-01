/**
 * nutrition-standards.js - 中国居民膳食营养标准
 * 基于中国居民膳食营养素参考摄入量 (DRIs)
 * 数据来源: 中国营养学会《中国居民膳食营养素参考摄入量》
 */

const nutritionStandards = {
  // 成年人能量需要量 (EER) - kcal/d
  energyRequirements: {
    // 男性
    male: {
      // 轻体力活动
      light: { '18-49': 2250, '50-64': 2100, '65-79': 2050, '80+': 1900 },
      // 中体力活动
      moderate: { '18-49': 2600, '50-64': 2450, '65-79': 2300, '80+': 2000 },
      // 重体力活动
      heavy: { '18-49': 3000, '50-64': 2800, '65-79': 2500, '80+': 2200 }
    },
    // 女性
    female: {
      // 轻体力活动
      light: { '18-49': 1800, '50-64': 1650, '65-79': 1550, '80+': 1400 },
      // 中体力活动
      moderate: { '18-49': 2100, '50-64': 1950, '65-79': 1800, '80+': 1600 },
      // 重体力活动
      heavy: { '18-49': 2400, '50-64': 2200, '65-79': 2000, '80+': 1800 }
    }
  },

  // 宏量营养素供能比参考范围
  macroNutrientRatios: {
    // 碳水化合物供能比
    carbs: {
      min: 50,    // 最小 50%
      max: 65,    // 最大 65%
      recommended: 55  // 推荐 55%
    },
    // 脂肪供能比
    fat: {
      min: 20,    // 最小 20%
      max: 30,    // 最大 30%
      recommended: 25  // 推荐 25%
    },
    // 蛋白质供能比
    protein: {
      min: 10,    // 最小 10%
      max: 15,    // 最大 15%
      recommended: 12  // 推荐 12%
    }
  },

  // 蛋白质需要量 (RNI) - g/d
  proteinRequirements: {
    male: { '18-49': 65, '50-64': 65, '65+': 65 },
    female: { '18-49': 55, '50-64': 55, '65+': 55 }
  },

  // 膳食纤维适宜摄入量 (AI) - g/d
  fiberRequirements: {
    adult: 25,     // 成年人 25g/d
    elderly: 20    // 老年人 20g/d
  },

  // 维生素推荐摄入量 (RNI/AI)
  vitamins: {
    // 维生素A (μgRAE/d)
    vitaminA: {
      male: { '18-49': 800, '50-64': 800, '65+': 800 },
      female: { '18-49': 700, '50-64': 700, '65+': 700 }
    },
    // 维生素C (mg/d)
    vitaminC: {
      adult: 100,
      elderly: 100
    },
    // 维生素D (μg/d)
    vitaminD: {
      '18-64': 5,
      '65+': 10
    },
    // 维生素E (mgα-TE/d)
    vitaminE: {
      adult: 14
    },
    // 维生素B1 (mg/d)
    vitaminB1: {
      male: { '18-49': 1.4, '50+': 1.4 },
      female: { '18-49': 1.2, '50+': 1.2 }
    },
    // 维生素B2 (mg/d)
    vitaminB2: {
      male: { '18-49': 1.4, '50+': 1.4 },
      female: { '18-49': 1.2, '50+': 1.2 }
    },
    // 烟酸 (mgNE/d)
    niacin: {
      male: { '18-49': 15, '50+': 15 },
      female: { '18-49': 12, '50+': 12 }
    }
  },

  // 矿物质推荐摄入量 (RNI/AI)
  minerals: {
    // 钙 (mg/d)
    calcium: {
      '18-49': 800,
      '50-64': 800,
      '65-79': 1000,
      '80+': 1000
    },
    // 铁 (mg/d)
    iron: {
      male: { '18-49': 12, '50+': 12 },
      female: { '18-49': 20, '50+': 12 }
    },
    // 锌 (mg/d)
    zinc: {
      male: { '18-49': 12.5, '50+': 12.5 },
      female: { '18-49': 7.5, '50+': 7.5 }
    },
    // 钠 (mg/d) - 这里的钠上限
    sodium: {
      adult: 2000,    // 推荐 < 2000mg/d (约5g盐)
      max: 2300       // 最高 2300mg/d
    },
    // 钾 (mg/d)
    potassium: {
      adult: 2000,
      min: 1600
    },
    // 镁 (mg/d)
    magnesium: {
      male: { '18-49': 330, '50+': 330 },
      female: { '18-49': 220, '50+': 220 }
    }
  },

  // BMI (身体质量指数) 分类标准
  bmiCategories: [
    {
      id: 'underweight',
      name: '偏瘦',
      range: [0, 18.5],
      color: '#FF9800',
      advice: '建议适当增加营养摄入，多吃优质蛋白质'
    },
    {
      id: 'normal',
      name: '正常',
      range: [18.5, 24],
      color: '#4CAF50',
      advice: '保持当前饮食习惯和生活方式'
    },
    {
      id: 'overweight',
      name: '超重',
      range: [24, 28],
      color: '#FFC107',
      advice: '建议控制饮食总热量，增加运动'
    },
    {
      id: 'obese',
      name: '肥胖',
      range: [28, 100],
      color: '#F44336',
      advice: '建议咨询营养师，制定减重计划'
    }
  ],

  // 基础代谢率计算公式 (Mifflin-St Jeor公式)
  // 男性: BMR = 10 × 体重kg + 6.25 × 身高cm - 5 × 年龄 + 5
  // 女性: BMR = 10 × 体重kg + 6.25 × 身高cm - 5 × 年龄 - 161
  bmrFormula: {
    male: (weight, height, age) => {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    },
    female: (weight, height, age) => {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  },

  // 活动系数
  activityFactors: {
    sedentary: 1.2,      // 久坐不动
    light: 1.375,        // 轻度活动
    moderate: 1.55,      // 中度活动
    activity: 1.725,     // 活跃
    very_active: 1.9     // 非常活跃
  },

  // 不同目标的卡路里调整
  goalCalorieAdjustment: {
    lose: -500,      // 减重: 每天减少500kcal
    maintain: 0,     // 维持: 不调整
    gain: 300        // 增重: 每天增加300kcal
  },

  // 中国居民膳食指南推荐餐次分配
  mealDistribution: {
    breakfast: 0.25,    // 早餐 25%
    lunch: 0.40,        // 午餐 40%
    dinner: 0.30,       // 晚餐 30%
    snack: 0.05         // 加餐 5%
  },

  // 食物交换份份量 (每份90kcal)
  foodExchangePortions: {
    // 谷薯类
    grains: 25,         // 25g 生重约 90kcal
    // 蔬菜类
    vegetables: 500,    // 500g 约 90kcal
    // 水果类
    fruits: 200,        // 200g 约 90kcal
    // 乳类
    dairy: 160,         // 160ml 牛奶约 90kcal
    // 蛋类
    eggs: 1,            // 1个鸡蛋约 70-90kcal
    // 大豆类
    beans: 25,          // 25g 大豆约 90kcal
    // 坚果类
    nuts: 15,           // 15g 坚果约 90kcal
    // 肉类
    meat: 50,           // 50g 瘦肉约 90kcal
    // 油脂类
    fats: 10            // 10g 油约 90kcal
  },

  // 推荐每日食物摄入量
  recommendedIntake: {
    // 谷薯类 (g/d)
    grains: {
      min: 250,
      max: 400,
      recommended: 300
    },
    // 蔬菜类 (g/d)
    vegetables: {
      min: 300,
      max: 500,
      recommended: 400
    },
    // 水果类 (g/d)
    fruits: {
      min: 200,
      max: 350,
      recommended: 250
    },
    // 畜禽肉类 (g/d)
    meat: {
      min: 40,
      max: 75,
      recommended: 50
    },
    // 鱼虾类 (g/d)
    seafood: {
      min: 40,
      max: 75,
      recommended: 50
    },
    // 蛋类 (g/d)
    eggs: {
      min: 40,
      max: 50,
      recommended: 50
    },
    // 奶及奶制品 (g/d)
    dairy: {
      min: 300,
      max: 500,
      recommended: 300
    },
    // 大豆及坚果类 (g/d)
    beans_nuts: {
      min: 25,
      max: 35,
      recommended: 30
    },
    // 油 (g/d)
    oil: {
      min: 25,
      max: 30,
      recommended: 25
    },
    // 盐 (g/d)
    salt: {
      min: 0,
      max: 5,
      recommended: 5
    }
  },

  // 常见营养成分换算系数
  nutrientConversion: {
    // 蛋白质: 1g = 4kcal
    protein: 4,
    // 碳水化合物: 1g = 4kcal
    carbs: 4,
    // 脂肪: 1g = 9kcal
    fat: 9,
    // 酒精: 1g = 7kcal
    alcohol: 7,
    // 膳食纤维: 1g ≈ 2kcal (可部分吸收)
    fiber: 2
  },

  // 饮水推荐量 (ml/d)
  waterIntake: {
    adult: 1500,       // 成年人 1500-1700ml
    active: 2000,      // 活跃人群 2000ml+
    hot: 2500          // 炎热环境 2500ml+
  }
};

// CommonJS 导出
module.exports = nutritionStandards;

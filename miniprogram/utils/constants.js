/**
 * constants.js - 应用常量定义
 *
 * 修复说明：
 * - 转换为 CommonJS 格式以兼容微信小程序
 * - 使用 module.exports
 */

// 存储键名常量
const STORAGE_KEYS = {
  // 用户相关
  USER_PROFILE: 'user_profile',
  USER_INFO: 'user_info',
  TODAY_NUTRITION: 'today_nutrition',

  // 食物记录
  FOOD_RECORDS: 'food_records',
  MEAL_HISTORY: 'meal_history',

  // 设置
  SETTINGS: 'settings',
  FIRST_LAUNCH: 'first_launch'
};

// 餐型常量
const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack'
};

// 餐型显示名称
const MEAL_TYPE_NAMES = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
  snack: '加餐'
};

// 健康目标常量
const GOAL_TYPES = {
  LOSE: 'lose',
  MAINTAIN: 'maintain',
  GAIN: 'gain'
};

// 健康目标显示名称
const GOAL_NAMES = {
  lose: '减重',
  maintain: '维持',
  gain: '增重'
};

// 性别常量
const GENDER_TYPES = {
  MALE: 'male',
  FEMALE: 'female'
};

// 性别显示名称
const GENDER_NAMES = {
  male: '男',
  female: '女'
};

// 活动水平常量
const ACTIVITY_LEVELS = {
  SEDENTARY: 'sedentary',
  LIGHT: 'light',
  MODERATE: 'moderate',
  ACTIVITY: 'activity'
};

// 活动水平显示名称
const ACTIVITY_LEVEL_NAMES = {
  sedentary: '久坐少动',
  light: '轻度活动',
  moderate: '中度活动',
  activity: '活跃运动'
};

// 活动系数
const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  activity: 1.725
};

// 食物分类常量
const FOOD_CATEGORIES = {
  GRAINS: 'grains',
  VEGETABLES: 'vegetables',
  FRUITS: 'fruits',
  MEAT: 'meat',
  SEAFOOD: 'seafood',
  DAIRY: 'dairy',
  BEANS: 'beans',
  NUTS: 'nuts',
  FATS: 'fats',
  BEVERAGES: 'beverages',
  SNACKS: 'snacks',
  CONDIMENTS: 'condiments'
};

// 营养素颜色
const NUTRIENT_COLORS = {
  calories: '#FF6B6B',
  protein: '#4ECDC4',
  carbs: '#FFE66D',
  fat: '#95E1D3',
  fiber: '#DDA0DD'
};

// 营养素单位
const NUTRIENT_UNITS = {
  calories: 'kcal',
  protein: 'g',
  carbs: 'g',
  fat: 'g',
  fiber: 'g'
};

// 营养素名称
const NUTRIENT_NAMES = {
  calories: '热量',
  protein: '蛋白质',
  carbs: '碳水化合物',
  fat: '脂肪',
  fiber: '膳食纤维'
};

// 卡路里目标调整值
const CALORIE_ADJUSTMENT = {
  lose: -500,
  maintain: 0,
  gain: 300
};

// 宏量营养素比例范围
const MACRO_RATIOS = {
  // 减重
  lose: {
    protein: 0.30,
    carbs: 0.40,
    fat: 0.30
  },
  // 维持
  maintain: {
    protein: 0.20,
    carbs: 0.50,
    fat: 0.30
  },
  // 增重
  gain: {
    protein: 0.25,
    carbs: 0.55,
    fat: 0.20
  }
};

// 营养素转换系数
const NUTRIENT_CONVERSION = {
  protein: 4,
  carbs: 4,
  fat: 9,
  fiber: 2,
  alcohol: 7
};

// BMI 分类
const BMI_CATEGORIES = {
  UNDERWEIGHT: { max: 18.5, name: '偏瘦', color: '#FF9800' },
  NORMAL: { min: 18.5, max: 24, name: '正常', color: '#4CAF50' },
  OVERWEIGHT: { min: 24, max: 28, name: '超重', color: '#FFC107' },
  OBESE: { min: 28, name: '肥胖', color: '#F44336' }
};

// 食谱分类
const RECIPE_CATEGORIES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack',
  VEGETARIAN: 'vegetarian'
};

// 食谱分类名称
const RECIPE_CATEGORY_NAMES = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
  snack: '加餐',
  vegetarian: '素食'
};

// 难度等级
const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

// 难度等级名称
const DIFFICULTY_NAMES = {
  easy: '简单',
  medium: '中等',
  hard: '困难'
};

// 难度等级颜色
const DIFFICULTY_COLORS = {
  easy: '#4CAF50',
  medium: '#FF9800',
  hard: '#F44336'
};

// 默认值
const DEFAULTS = {
  // 默认用户档案
  USER_PROFILE: {
    name: '',
    gender: 'male',
    age: 25,
    height: 170,
    weight: 65,
    activityLevel: 'moderate',
    goal: 'maintain',
    targetWeight: 65,
    dailyCalorieTarget: 2000,
    proteinTarget: 100,
    carbsTarget: 250,
    fatTarget: 65,
    fiberTarget: 25
  },

  // 默认营养目标
  NUTRITION_TARGETS: {
    calories: 2000,
    protein: 100,
    carbs: 250,
    fat: 65,
    fiber: 25
  },

  // 常用食物份量
  PORTION_SIZES: {
    small: 50,
    medium: 100,
    large: 150,
    extraLarge: 200
  }
};

// 推荐每日食物摄入量
const RECOMMENDED_INTAKE = {
  grains: { min: 250, max: 400, unit: 'g' },
  vegetables: { min: 300, max: 500, unit: 'g' },
  fruits: { min: 200, max: 350, unit: 'g' },
  meat: { min: 40, max: 75, unit: 'g' },
  seafood: { min: 40, max: 75, unit: 'g' },
  eggs: { min: 40, max: 50, unit: 'g' },
  dairy: { min: 300, max: 500, unit: 'ml' },
  beans_nuts: { min: 25, max: 35, unit: 'g' },
  oil: { min: 25, max: 30, unit: 'g' },
  salt: { max: 5, unit: 'g' }
};

// 常用提示语
const TIPS = {
  // 减重提示
  WEIGHT_LOSS: [
    '每餐吃到七八分饱即可',
    '细嚼慢咽有助于控制食量',
    '饭前喝杯水可以增加饱腹感',
    '用小盘子盛餐可以减少摄入',
    '多吃蔬菜增加饱腹感'
  ],

  // 增重提示
  WEIGHT_GAIN: [
    '少食多餐，每天可吃5-6餐',
    '选择营养密度高的食物',
    '餐间可以适当加餐',
    '运动后及时补充蛋白质',
    '可以适量增加坚果和健康脂肪摄入'
  ],

  // 健康饮食提示
  HEALTHY_EATING: [
    '每餐都要有蛋白质',
    '每天吃够5份蔬菜水果',
    '选择全谷物代替精制谷物',
    '控制添加糖的摄入',
    '适量饮水，每天1500-2000ml'
  ]
};

// 日期格式
const DATE_FORMATS = {
  FULL: 'YYYY-MM-DD HH:mm:ss',
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  MONTH: 'YYYY-MM',
  CN_FULL: 'YYYY年MM月DD日 HH:mm',
  CN_DATE: 'YYYY年MM月DD日'
};

// API 错误码
const ERROR_CODES = {
  SUCCESS: 0,
  NETWORK_ERROR: -1,
  INVALID_PARAM: -2,
  NOT_FOUND: -3,
  SERVER_ERROR: -4,
  TIMEOUT: -5
};

// 动画时长
const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500
};

// 防抖/节流时间
const THROTTLE_TIME = {
  INPUT: 300,
  SCROLL: 100,
  CLICK: 500
};

// 页面路径
const PAGE_PATHS = {
  INDEX: '/pages/index/index',
  FOOD_SEARCH: '/pages/food-search/food-search',
  MEAL_RECORD: '/pages/meal-record/meal-record',
  RECIPE_LIST: '/pages/recipe-list/recipe-list',
  RECIPE_DETAIL: '/pages/recipe-detail/recipe-detail',
  PROFILE: '/pages/profile/profile'
};

// 导出所有常量
module.exports = {
  STORAGE_KEYS,
  MEAL_TYPES,
  MEAL_TYPE_NAMES,
  GOAL_TYPES,
  GOAL_NAMES,
  GENDER_TYPES,
  GENDER_NAMES,
  ACTIVITY_LEVELS,
  ACTIVITY_LEVEL_NAMES,
  ACTIVITY_MULTIPLIERS,
  FOOD_CATEGORIES,
  NUTRIENT_COLORS,
  NUTRIENT_UNITS,
  NUTRIENT_NAMES,
  CALORIE_ADJUSTMENT,
  MACRO_RATIOS,
  NUTRIENT_CONVERSION,
  BMI_CATEGORIES,
  RECIPE_CATEGORIES,
  RECIPE_CATEGORY_NAMES,
  DIFFICULTY_LEVELS,
  DIFFICULTY_NAMES,
  DIFFICULTY_COLORS,
  DEFAULTS,
  RECOMMENDED_INTAKE,
  TIPS,
  DATE_FORMATS,
  ERROR_CODES,
  ANIMATION_DURATION,
  THROTTLE_TIME,
  PAGE_PATHS
};

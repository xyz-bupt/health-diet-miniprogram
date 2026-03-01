/**
 * food-categories.js - 食物分类数据
 * 定义食物的分类体系
 *
 * 修复说明：
 * - 转换为 CommonJS 格式以兼容微信小程序
 * - 使用 module.exports
 */

// 食物分类列表
const categories = [
  {
    id: 'grains',
    name: '谷薯类',
    icon: '🌾',
    color: '#FFB74D',
    description: '提供碳水化合物和B族维生素',
    subcategories: [
      { id: 'rice', name: '米类' },
      { id: 'wheat', name: '麦类' },
      { id: 'corn', name: '玉米' },
      { id: 'tuber', name: '薯类' },
      { id: 'other_grains', name: '其他杂粮' }
    ]
  },
  {
    id: 'vegetables',
    name: '蔬菜类',
    icon: '🥬',
    color: '#66BB6A',
    description: '提供维生素、矿物质和膳食纤维',
    subcategories: [
      { id: 'leafy', name: '叶菜类' },
      { id: 'cruciferous', name: '十字花科' },
      { id: 'root', name: '根茎类' },
      { id: 'solanaceous', name: '茄果类' },
      { id: 'cucurbit', name: '瓜类' },
      { id: 'legume_veg', name: '豆荚类' },
      { id: 'mushroom', name: '菌藻类' },
      { id: 'other_veg', name: '其他蔬菜' }
    ]
  },
  {
    id: 'fruits',
    name: '水果类',
    icon: '🍎',
    color: '#EF5350',
    description: '提供维生素C、钾和膳食纤维',
    subcategories: [
      { id: 'citrus', name: '柑橘类' },
      { id: 'stone', name: '仁果类' },
      { id: 'berry', name: '浆果类' },
      { id: 'tropical', name: '热带水果' },
      { id: 'melon', name: '瓜果类' },
      { id: 'other_fruit', name: '其他水果' }
    ]
  },
  {
    id: 'meat',
    name: '肉禽蛋类',
    icon: '🥩',
    color: '#F44336',
    description: '提供优质蛋白质、脂肪和矿物质',
    subcategories: [
      { id: 'pork', name: '猪肉' },
      { id: 'beef', name: '牛肉' },
      { id: 'lamb', name: '羊肉' },
      { id: 'poultry', name: '禽肉' },
      { id: 'egg', name: '蛋类' },
      { id: 'processed_meat', name: '加工肉制品' }
    ]
  },
  {
    id: 'seafood',
    name: '水产类',
    icon: '🐟',
    color: '#42A5F5',
    description: '提供优质蛋白质和不饱和脂肪酸',
    subcategories: [
      { id: 'freshwater_fish', name: '淡水鱼' },
      { id: 'marine_fish', name: '海水鱼' },
      { id: 'shrimp_crab', name: '虾蟹类' },
      { id: 'shellfish', name: '贝类' },
      { id: 'other_seafood', name: '其他水产' }
    ]
  },
  {
    id: 'dairy',
    name: '奶制品',
    icon: '🥛',
    color: '#7E57C2',
    description: '提供钙、蛋白质和维生素',
    subcategories: [
      { id: 'milk', name: '液态奶' },
      { id: 'yogurt', name: '酸奶' },
      { id: 'cheese', name: '奶酪' },
      { id: 'other_dairy', name: '其他奶制品' }
    ]
  },
  {
    id: 'beans',
    name: '豆类及其制品',
    icon: '🫘',
    color: '#8D6E63',
    description: '提供植物蛋白、膳食纤维和异黄酮',
    subcategories: [
      { id: 'soybean', name: '大豆' },
      { id: 'soy_product', name: '豆制品' },
      { id: 'other_beans', name: '其他豆类' }
    ]
  },
  {
    id: 'nuts',
    name: '坚果种子类',
    icon: '🥜',
    color: '#A1887F',
    description: '提供健康脂肪、蛋白质和矿物质',
    subcategories: [
      { id: 'nuts', name: '坚果' },
      { id: 'seeds', name: '种子' }
    ]
  },
  {
    id: 'fats',
    name: '油脂类',
    icon: '🫒',
    color: '#FFC107',
    description: '提供必需脂肪酸',
    subcategories: [
      { id: 'plant_oil', name: '植物油' },
      { id: 'animal_oil', name: '动物油' },
      { id: 'other_fats', name: '其他油脂' }
    ]
  },
  {
    id: 'beverages',
    name: '饮品',
    icon: '🍵',
    color: '#26A69A',
    description: '补充水分和部分营养素',
    subcategories: [
      { id: 'tea', name: '茶类' },
      { id: 'coffee', name: '咖啡' },
      { id: 'juice', name: '果汁' },
      { id: 'other_drinks', name: '其他饮品' }
    ]
  },
  {
    id: 'snacks',
    name: '零食',
    icon: '🍪',
    color: '#EC407A',
    description: '各种休闲食品',
    subcategories: [
      { id: 'sweet', name: '甜食' },
      { id: 'salty', name: '咸味零食' },
      { id: 'fried', name: '油炸食品' }
    ]
  },
  {
    id: 'condiments',
    name: '调味品',
    icon: '🧂',
    color: '#78909C',
    description: '调味和增香',
    subcategories: [
      { id: 'sauce', name: '酱类' },
      { id: 'seasoning', name: '调料' }
    ]
  }
];

// 餐型分类
const mealTypes = [
  { id: 'breakfast', name: '早餐', icon: '🌅', time: '06:00-09:00' },
  { id: 'lunch', name: '午餐', icon: '☀️', time: '11:00-13:00' },
  { id: 'dinner', name: '晚餐', icon: '🌙', time: '17:00-20:00' },
  { id: 'snack', name: '加餐', icon: '🍎', time: '任意时间' }
];

// 健康目标分类
const goals = [
  { id: 'lose', name: '减重', description: '热量赤字，控制体重', color: '#EF5350' },
  { id: 'maintain', name: '维持', description: '热量平衡，保持体重', color: '#66BB6A' },
  { id: 'gain', name: '增重', description: '热量盈余，增加体重', color: '#42A5F5' }
];

// 活动水平分类
const activityLevels = [
  {
    id: 'sedentary',
    name: '久坐少动',
    description: '几乎不运动，办公室工作',
    multiplier: 1.2,
    examples: ['办公室职员', '司机', '程序员']
  },
  {
    id: 'light',
    name: '轻度活动',
    description: '每周1-3次轻度运动',
    multiplier: 1.375,
    examples: ['教师', '售货员', '家务劳动者']
  },
  {
    id: 'moderate',
    name: '中度活动',
    description: '每周3-5次中等运动',
    multiplier: 1.55,
    examples: ['建筑工人', '农民', '快递员']
  },
  {
    id: 'activity',
    name: '活跃',
    description: '每周6-7次运动',
    multiplier: 1.725,
    examples: ['运动员', '建筑工人', '经常健身者']
  }
];

// 营养素分类
const nutrients = [
  { id: 'calories', name: '热量', unit: 'kcal', color: '#FF6B6B' },
  { id: 'protein', name: '蛋白质', unit: 'g', color: '#4ECDC4' },
  { id: 'carbs', name: '碳水化合物', unit: 'g', color: '#FFE66D' },
  { id: 'fat', name: '脂肪', unit: 'g', color: '#95E1D3' },
  { id: 'fiber', name: '膳食纤维', unit: 'g', color: '#DDA0DD' },
  { id: 'vitamin_c', name: '维生素C', unit: 'mg', color: '#FF8C00' },
  { id: 'calcium', name: '钙', unit: 'mg', color: '#87CEEB' },
  { id: 'iron', name: '铁', unit: 'mg', color: '#CD5C5C' }
];

// CommonJS 导出
module.exports = {
  categories,
  mealTypes,
  goals,
  activityLevels,
  nutrients
};

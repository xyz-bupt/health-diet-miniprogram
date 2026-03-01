/**
 * data/index.js - 数据层统一导出
 *
 * 修复说明：
 * - 转换为 CommonJS 格式以兼容微信小程序
 * - 使用 module.exports
 */

const foodDatabase = require('./food-database.js');
const foodCategories = require('./food-categories.js');
const recipeDatabase = require('./recipe-database.js');
const nutritionStandards = require('./nutrition-standards.js');

module.exports = {
  foodDatabase,
  foodCategories,
  recipeDatabase,
  nutritionStandards
};

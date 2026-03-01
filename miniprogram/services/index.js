/**
 * services/index.js - 服务层统一导出
 *
 * 使用方式：
 *   import { storageService, foodService } from '../services/index.js';
 *   // 或单独导入
 *   import storageService from '../services/storage-service.js';
 */

export { default as storageService } from './storage-service.js';
export { default as foodService } from './food-service.js';
export { default as nutritionService } from './nutrition-service.js';
export { default as recipeService } from './recipe-service.js';

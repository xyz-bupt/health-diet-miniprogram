// app.js - 微信小程序应用入口文件
// 健康饮食小程序主应用
//
// 修复说明：
// - 转换为 CommonJS 格式以兼容微信小程序
// - 使用 require 和 module.exports

const {
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  calculateCalorieTarget,
  calculateMacros
} = require('./utils/nutrition-calculator.js');

App({
  /**
   * 全局数据
   */
  globalData: {
    // 用户信息
    userInfo: null,

    // 用户档案数据
    userProfile: {
      // 基本信息
      name: '健康达人',
      gender: 'male', // male: 男, female: 女
      age: 25,
      height: 170, // cm
      weight: 65, // kg
      activityLevel: 'moderate', // activity: 活跃, moderate: 中等, light: 轻度, sedentary: 久坐

      // 健康目标
      goal: 'maintain', // lose: 减重, maintain: 维持, gain: 增重
      targetWeight: 65, // kg

      // 营养目标
      dailyCalorieTarget: 2000,
      proteinTarget: 100, // g
      carbsTarget: 250, // g
      fatTarget: 65, // g
      fiberTarget: 25, // g

      // 计算结果
      bmi: 0,
      bmr: 0,
      tdee: 0
    },

    // 今日营养摄入
    todayNutrition: {
      date: '',
      meals: {
        breakfast: { foods: [], calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
        lunch: { foods: [], calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
        dinner: { foods: [], calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
        snack: { foods: [], calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
      },
      total: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0
      }
    },

    // 系统配置
    config: {
      appVersion: '1.0.0',
      lastUpdateDate: '2024-01-01'
    },

    // AI配置
    aiConfig: {
      provider: 'deepseek',
      apiKey: '',
      baseUrl: '',
      model: ''
    }
  },

  /**
   * 应用生命周期 - 启动时触发
   */
  onLaunch(options) {
    console.log('小程序启动', options);

    // 初始化应用数据
    this.initApp();

    // 检查更新
    this.checkUpdate();
  },

  /**
   * 应用生命周期 - 显示时触发
   */
  onShow(options) {
    console.log('小程序显示', options);

    // 刷新今日数据
    this.refreshTodayData();
  },

  /**
   * 应用生命周期 - 隐藏时触发
   */
  onHide() {
    console.log('小程序隐藏');

    // 保存数据
    this.saveData();
  },

  /**
   * 初始化应用
   */
  initApp() {
    try {
      // 加载保存的用户数据（使用 wx.getStorageSync）
      this.loadUserData();

      // 初始化今日营养数据
      this.initTodayNutrition();

      // 计算用户默认值
      this.calculateUserTargets();

      console.log('应用初始化完成');
    } catch (error) {
      console.error('应用初始化失败:', error);
    }
  },

  /**
   * 加载用户数据（使用 wx.getStorageSync 同步方法）
   */
  loadUserData() {
    try {
      // 使用 wx.getStorageSync 同步加载用户档案
      const userProfileData = wx.getStorageSync('user_profile');
      if (userProfileData) {
        this.globalData.userProfile = userProfileData;
      }

      // 使用 wx.getStorageSync 同步加载今日营养数据
      const todayNutritionData = wx.getStorageSync('today_nutrition');
      if (todayNutritionData) {
        // 检查是否是今天的数据
        const today = this.getTodayDate();
        if (todayNutritionData.date === today) {
          this.globalData.todayNutrition = todayNutritionData;
        }
      }

      // 加载AI配置
      const aiConfigData = wx.getStorageSync('ai_config');
      if (aiConfigData) {
        // 兼容旧字段名 apiBaseUrl -> baseUrl
        if (aiConfigData.apiBaseUrl && !aiConfigData.baseUrl) {
          aiConfigData.baseUrl = aiConfigData.apiBaseUrl;
        }
        this.globalData.aiConfig = {
          provider: aiConfigData.provider || 'deepseek',
          apiKey: aiConfigData.apiKey || '',
          baseUrl: aiConfigData.baseUrl || '',
          model: aiConfigData.model || ''
        };
      }

      console.log('用户数据加载成功');
    } catch (error) {
      console.error('加载用户数据失败:', error);
    }
  },

  /**
   * 初始化今日营养数据
   */
  initTodayNutrition() {
    const today = this.getTodayDate();

    if (this.globalData.todayNutrition.date !== today) {
      // 新的一天，重置数据
      this.globalData.todayNutrition = {
        date: today,
        meals: {
          breakfast: { foods: [], calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
          lunch: { foods: [], calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
          dinner: { foods: [], calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
          snack: { foods: [], calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
        },
        total: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0
        }
      };

      // 异步保存初始数据（不阻塞）
      wx.setStorage({
        key: 'today_nutrition',
        data: this.globalData.todayNutrition
      });
    }
  },

  /**
   * 刷新今日数据
   */
  refreshTodayData() {
    const today = this.getTodayDate();
    if (this.globalData.todayNutrition.date !== today) {
      this.initTodayNutrition();
    }
  },

  /**
   * 计算用户的营养目标
   */
  calculateUserTargets() {
    const profile = this.globalData.userProfile;

    // 计算BMI、BMR、TDEE
    profile.bmi = calculateBMI(profile.height, profile.weight);
    profile.bmr = calculateBMR(profile.gender, profile.weight, profile.height, profile.age);
    profile.tdee = calculateTDEE(profile.bmr, profile.activityLevel);

    // 根据目标设置卡路里目标
    profile.dailyCalorieTarget = calculateCalorieTarget(profile.tdee, profile.goal);

    // 设置宏量营养素目标
    const macros = calculateMacros(profile.dailyCalorieTarget, profile.goal);
    profile.proteinTarget = macros.protein;
    profile.carbsTarget = macros.carbs;
    profile.fatTarget = macros.fat;

    console.log('用户目标计算完成', profile);
  },

  /**
   * 设置默认值
   */
  setDefaultValue() {
    this.calculateUserTargets();
    console.log('默认值设置完成');
  },

  /**
   * 保存数据（异步，不阻塞）
   */
  saveData() {
    try {
      // 保存用户档案
      wx.setStorage({
        key: 'user_profile',
        data: this.globalData.userProfile
      });

      // 保存今日营养数据
      wx.setStorage({
        key: 'today_nutrition',
        data: this.globalData.todayNutrition
      });

      console.log('数据保存成功');
    } catch (error) {
      console.error('保存数据失败:', error);
    }
  },

  /**
   * 添加食物到今日记录
   * @param {string} mealType - 餐型 (breakfast/lunch/dinner/snack)
   * @param {object} food - 食物信息
   * @param {number} amount - 食用量 (克)
   */
  addFoodToMeal(mealType, food, amount) {
    try {
      const meal = this.globalData.todayNutrition.meals[mealType];

      // 计算营养值
      const factor = amount / 100;
      const calories = Math.round(food.calories * factor);
      const protein = Math.round(food.protein * factor * 10) / 10;
      const carbs = Math.round(food.carbs * factor * 10) / 10;
      const fat = Math.round(food.fat * factor * 10) / 10;
      const fiber = Math.round(food.fiber * factor * 10) / 10;

      // 添加到餐食
      meal.foods.push({
        id: food.id,
        name: food.name,
        amount: amount,
        calories: calories,
        protein: protein,
        carbs: carbs,
        fat: fat,
        fiber: fiber,
        time: new Date().getTime()
      });

      // 更新餐食总计
      meal.calories += calories;
      meal.protein += protein;
      meal.carbs += carbs;
      meal.fat += fat;
      meal.fiber += fiber;

      // 更新今日总计
      this.updateTodayTotal();

      // 异步保存数据（不阻塞）
      wx.setStorage({
        key: 'today_nutrition',
        data: this.globalData.todayNutrition
      });

      console.log('添加食物成功', mealType, food.name, amount);
      return true;
    } catch (error) {
      console.error('添加食物失败:', error);
      return false;
    }
  },

  /**
   * 删除食物记录
   * @param {string} mealType - 餐型
   * @param {number} index - 食物索引
   */
  removeFoodFromMeal(mealType, index) {
    try {
      const meal = this.globalData.todayNutrition.meals[mealType];
      const food = meal.foods[index];

      if (!food) return false;

      // 减去营养值
      meal.calories -= food.calories;
      meal.protein -= food.protein;
      meal.carbs -= food.carbs;
      meal.fat -= food.fat;
      meal.fiber -= food.fiber;

      // 删除食物
      meal.foods.splice(index, 1);

      // 更新今日总计
      this.updateTodayTotal();

      // 异步保存数据（不阻塞）
      wx.setStorage({
        key: 'today_nutrition',
        data: this.globalData.todayNutrition
      });

      console.log('删除食物成功', mealType, index);
      return true;
    } catch (error) {
      console.error('删除食物失败:', error);
      return false;
    }
  },

  /**
   * 更新今日总计
   */
  updateTodayTotal() {
    const meals = this.globalData.todayNutrition.meals;
    const total = this.globalData.todayNutrition.total;

    total.calories = 0;
    total.protein = 0;
    total.carbs = 0;
    total.fat = 0;
    total.fiber = 0;

    for (const key in meals) {
      total.calories += meals[key].calories;
      total.protein += meals[key].protein;
      total.carbs += meals[key].carbs;
      total.fat += meals[key].fat;
      total.fiber += meals[key].fiber;
    }

    // 四舍五入
    total.protein = Math.round(total.protein * 10) / 10;
    total.carbs = Math.round(total.carbs * 10) / 10;
    total.fat = Math.round(total.fat * 10) / 10;
    total.fiber = Math.round(total.fiber * 10) / 10;
  },

  /**
   * 更新用户档案
   * @param {object} profile - 用户档案数据
   */
  updateUserProfile(profile) {
    try {
      this.globalData.userProfile = { ...this.globalData.userProfile, ...profile };

      // 重新计算营养目标
      this.calculateUserTargets();

      // 异步保存数据（不阻塞）
      wx.setStorage({
        key: 'user_profile',
        data: this.globalData.userProfile
      });

      console.log('用户档案更新成功');
      return true;
    } catch (error) {
      console.error('更新用户档案失败:', error);
      return false;
    }
  },

  /**
   * 获取今日日期字符串
   */
  getTodayDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * 检查小程序更新
   */
  checkUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();

      updateManager.onCheckForUpdate((res) => {
        console.log('检查更新结果:', res.hasUpdate);
      });

      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已准备好，是否重启应用？',
          success: (res) => {
            if (res.confirm) {
              updateManager.applyUpdate();
            }
          }
        });
      });

      updateManager.onUpdateFailed(() => {
        console.error('新版本下载失败');
      });
    }
  }
});

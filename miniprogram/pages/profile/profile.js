/**
 * pages/profile/profile.js - 个人资料页面
 *
 * 修复说明：
 * - 将 Component() 改为 Page()
 * - 使用 CommonJS require 替代 ES6 import 以兼容微信小程序
 * - 移除 lifetimes 和 pageLifetimes，使用 onLoad 和 onShow
 */
const app = getApp();
const {
  calculateBMI,
  getBMICategory,
  calculateBMR,
  calculateTDEE,
  calculateIdealWeightRange,
  calculateWeightLossTime,
  calculateWeightGainTime
} = require('../../utils/nutrition-calculator.js');
const {
  GOAL_NAMES,
  ACTIVITY_LEVEL_NAMES,
  GENDER_NAMES
} = require('../../utils/constants.js');

Page({
  /**
   * 页面数据
   */
  data: {
    // 用户档案
    userProfile: null,

    // 计算结果
    metrics: {},

    // 编辑状态
    editMode: false,

    // 表单数据
    formData: {},

    // 目标选项
    goalOptions: [
      { value: 'lose', label: '减重', color: '#EF5350' },
      { value: 'maintain', label: '维持', color: '#66BB6A' },
      { value: 'gain', label: '增重', color: '#42A5F5' }
    ],

    // 活动水平选项
    activityOptions: [
      { value: 'sedentary', label: '久坐少动', multiplier: 1.2 },
      { value: 'light', label: '轻度活动', multiplier: 1.375 },
      { value: 'moderate', label: '中度活动', multiplier: 1.55 },
      { value: 'activity', label: '活跃运动', multiplier: 1.725 }
    ],

    // BMI分类
    bmiCategory: {},

    // 名称映射
    genderNames: GENDER_NAMES,
    activityLevelNames: ACTIVITY_LEVEL_NAMES,

    // 加载状态
    loading: false
  },

  /**
   * 页面生命周期 - 页面加载时触发
   */
  onLoad(options) {
    console.log('profile page onLoad');
    try {
      this.loadData();
    } catch (e) {
      console.error('加载数据失败:', e);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  /**
   * 页面生命周期 - 页面显示时触发
   */
  onShow() {
    console.log('profile page onShow');
  },

  /**
   * 加载数据
   */
  loadData() {
    const userProfile = app.globalData.userProfile;

    if (!userProfile) {
      console.warn('用户档案为空，使用默认值');
      // 使用默认值
      const defaultProfile = {
        name: '健康达人',
        gender: 'male',
        age: 25,
        height: 170,
        weight: 65,
        targetWeight: 65,
        goal: 'maintain',
        activityLevel: 'moderate',
        dailyCalorieTarget: 2000,
        proteinTarget: 100,
        carbsTarget: 250,
        fatTarget: 65,
        fiberTarget: 25
      };

      const metrics = this.calculateMetrics(defaultProfile);
      const bmiCategory = getBMICategory(metrics.bmi);

      this.setData({
        userProfile: defaultProfile,
        formData: { ...defaultProfile },
        metrics,
        bmiCategory
      });
      return;
    }

    // 计算各项指标
    const metrics = this.calculateMetrics(userProfile);
    const bmiCategory = getBMICategory(metrics.bmi);

    this.setData({
      userProfile,
      formData: { ...userProfile },
      metrics,
      bmiCategory
    });
  },

  /**
   * 计算各项指标
   */
  calculateMetrics(profile) {
    const bmi = calculateBMI(profile.height, profile.weight);
    const bmr = calculateBMR(profile.gender, profile.weight, profile.height, profile.age);
    const tdee = calculateTDEE(bmr, profile.activityLevel);
    const idealWeightRange = calculateIdealWeightRange(profile.height);

    // 计算目标体重预计时间
    let targetTime = null;
    if (profile.goal === 'lose' && profile.targetWeight < profile.weight) {
      targetTime = calculateWeightLossTime(profile.weight, profile.targetWeight);
    } else if (profile.goal === 'gain' && profile.targetWeight > profile.weight) {
      targetTime = calculateWeightGainTime(profile.weight, profile.targetWeight);
    }

    return {
      bmi: bmi.toFixed(1),
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      idealWeightRange,
      targetTime
    };
  },

  /**
   * 进入编辑模式
   */
  onEdit() {
    console.log('点击编辑');
    // 确保 userProfile 存在
    const profile = this.data.userProfile || {
      name: '健康达人',
      gender: 'male',
      age: 25,
      height: 170,
      weight: 65,
      targetWeight: 65,
      goal: 'maintain',
      activityLevel: 'moderate',
      dailyCalorieTarget: 2000,
      proteinTarget: 100,
      carbsTarget: 250,
      fatTarget: 65,
      fiberTarget: 25
    };

    this.setData({
      editMode: true,
      formData: { ...profile }
    });
  },

  /**
   * 阻止事件冒泡（用于编辑对话框）
   */
  stopPropagation() {
    // 空函数，仅用于阻止事件冒泡
  },

  /**
   * 取消编辑
   */
  onCancel() {
    console.log('取消编辑');
    this.setData({
      editMode: false,
      formData: { ...this.data.userProfile }
    });
  },

  /**
   * 表单输入变化
   */
  onInputChange(e) {
    try {
      const field = e.currentTarget.dataset.field;
      const value = e.detail.value;

      this.setData({
        [`formData.${field}`]: value
      });
    } catch (error) {
      console.error('输入变化处理失败:', error);
    }
  },

  /**
   * 选择目标
   */
  onGoalSelect(e) {
    try {
      const goal = e.currentTarget.dataset.value;
      this.setData({
        'formData.goal': goal
      });
    } catch (error) {
      console.error('选择目标失败:', error);
    }
  },

  /**
   * 选择活动水平
   */
  onActivitySelect(e) {
    try {
      const activityLevel = e.currentTarget.dataset.value;
      this.setData({
        'formData.activityLevel': activityLevel
      });
    } catch (error) {
      console.error('选择活动水平失败:', error);
    }
  },

  /**
   * 选择性别
   */
  onGenderSelect(e) {
    try {
      const gender = e.currentTarget.dataset.value;
      this.setData({
        'formData.gender': gender
      });
    } catch (error) {
      console.error('选择性别失败:', error);
    }
  },

  /**
   * 保存修改
   */
  onSave() {
    const { formData } = this.data;

    console.log('保存表单数据:', formData);

    // 验证数据
    if (!formData.name || !formData.name.trim()) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      });
      return;
    }

    const age = parseInt(formData.age);
    if (!age || age < 1 || age > 120) {
      wx.showToast({
        title: '请输入有效年龄',
        icon: 'none'
      });
      return;
    }

    const height = parseInt(formData.height);
    if (!height || height < 100 || height > 250) {
      wx.showToast({
        title: '请输入有效身高(100-250cm)',
        icon: 'none'
      });
      return;
    }

    const weight = parseFloat(formData.weight);
    if (!weight || weight < 30 || weight > 200) {
      wx.showToast({
        title: '请输入有效体重(30-200kg)',
        icon: 'none'
      });
      return;
    }

    const targetWeight = parseFloat(formData.targetWeight);
    if (!targetWeight || targetWeight < 30 || targetWeight > 200) {
      wx.showToast({
        title: '请输入有效目标体重',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '保存中...'
    });

    try {
      // 更新用户档案到全局数据
      app.globalData.userProfile = {
        ...formData,
        age: age,
        height: height,
        weight: weight,
        targetWeight: targetWeight
      };

      // 重新计算指标
      const metrics = this.calculateMetrics(app.globalData.userProfile);
      const bmiCategory = getBMICategory(metrics.bmi);

      // 更新营养目标
      const bmr = calculateBMR(formData.gender, weight, height, age);
      const tdee = calculateTDEE(bmr, formData.activityLevel);

      let calorieTarget = tdee;
      if (formData.goal === 'lose') {
        calorieTarget = tdee * 0.85;
      } else if (formData.goal === 'gain') {
        calorieTarget = tdee * 1.15;
      }

      app.globalData.userProfile.dailyCalorieTarget = Math.round(calorieTarget);
      app.globalData.userProfile.proteinTarget = Math.round((calorieTarget * 0.25) / 4);
      app.globalData.userProfile.carbsTarget = Math.round((calorieTarget * 0.45) / 4);
      app.globalData.userProfile.fatTarget = Math.round((calorieTarget * 0.30) / 9);
      app.globalData.userProfile.bmr = Math.round(bmr);
      app.globalData.userProfile.tdee = Math.round(tdee);
      app.globalData.userProfile.bmi = metrics.bmi;

      this.setData({
        userProfile: app.globalData.userProfile,
        metrics,
        bmiCategory,
        editMode: false,
        loading: false
      });

      wx.hideLoading();
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      });
    } catch (error) {
      console.error('保存失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '保存失败，请重试',
        icon: 'none'
      });
    }
  },

  /**
   * 重置数据
   */
  onReset() {
    wx.showModal({
      title: '确认重置',
      content: '确定要重置所有数据吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          try {
            // 清空今日数据
            app.globalData.todayNutrition = {
              date: new Date().toISOString().split('T')[0],
              meals: {
                breakfast: { foods: [], calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
                lunch: { foods: [], calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
                dinner: { foods: [], calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
                snack: { foods: [], calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
              },
              total: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
            };

            wx.showToast({
              title: '重置成功',
              icon: 'success'
            });
            this.loadData();
          } catch (error) {
            console.error('重置失败:', error);
            wx.showToast({
              title: '重置失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  /**
   * 关于我们
   */
  onAbout() {
    wx.showModal({
      title: '关于健康饮食',
      content: '健康饮食小程序 v1.0.0\n\n帮助您科学管理饮食，追踪营养摄入，实现健康目标。',
      showCancel: false
    });
  },

  /**
   * 反馈建议
   */
  onFeedback() {
    wx.showToast({
      title: '感谢您的反馈！',
      icon: 'none'
    });
  },

  /**
   * 查看健康报告
   */
  onViewReport() {
    wx.showToast({
      title: '健康报告功能开发中',
      icon: 'none'
    });
  }
});

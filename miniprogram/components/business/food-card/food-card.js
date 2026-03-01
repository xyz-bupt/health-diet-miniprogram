/**
 * food-card.js - 食物卡片组件
 * 用于展示食物信息的卡片组件
 */
Component({
  /**
   * 组件属性
   */
  properties: {
    // 食物信息
    food: {
      type: Object,
      value: null
    },
    // 食用量（克）
    amount: {
      type: Number,
      value: 100
    },
    // 是否显示营养信息
    showNutrition: {
      type: Boolean,
      value: true
    },
    // 是否可点击
    clickable: {
      type: Boolean,
      value: true
    },
    // 卡片模式 (default/compact/minimal)
    mode: {
      type: String,
      value: 'default'
    }
  },

  /**
   * 组件数据
   */
  data: {
    nutritionInfo: null
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    attached() {
      this.calculateNutrition();
    }
  },

  /**
   * 属性监听器
   */
  observers: {
    'food, amount': function() {
      this.calculateNutrition();
    }
  },

  /**
   * 组件方法
   */
  methods: {
    /**
     * 计算营养信息
     */
    calculateNutrition() {
      const { food, amount } = this.properties;

      if (!food) return;

      const factor = amount / 100;
      const nutrition = {
        calories: Math.round(food.calories * factor),
        protein: Math.round((food.protein * factor) * 10) / 10,
        carbs: Math.round((food.carbs * factor) * 10) / 10,
        fat: Math.round((food.fat * factor) * 10) / 10,
        fiber: Math.round((food.fiber * factor) * 10) / 10
      };

      this.setData({ nutritionInfo: nutrition });
    },

    /**
     * 点击卡片
     */
    handleTap() {
      if (!this.properties.clickable) return;

      this.triggerEvent('tap', {
        food: this.properties.food,
        amount: this.properties.amount,
        nutrition: this.data.nutritionInfo
      });
    },

    /**
     * 长按卡片
     */
    handleLongPress() {
      this.triggerEvent('longpress', {
        food: this.properties.food
      });
    }
  }
});

/**
 * nutrition-bar.js - 营养进度条组件
 * 用于展示营养摄入进度
 */
Component({
  /**
   * 组件属性
   */
  properties: {
    // 当前进度值
    value: {
      type: Number,
      value: 0
    },
    // 目标值
    target: {
      type: Number,
      value: 100
    },
    // 营养素名称
    label: {
      type: String,
      value: ''
    },
    // 单位
    unit: {
      type: String,
      value: 'g'
    },
    // 颜色
    color: {
      type: String,
      value: '#4CAF50'
    },
    // 是否显示百分比
    showPercent: {
      type: Boolean,
      value: true
    },
    // 进度条粗细
    strokeWidth: {
      type: Number,
      value: 8
    },
    // 是否显示动画
    animated: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件数据
   */
  data: {
    percentage: 0,
    displayValue: 0,
    status: 'normal',
    statusText: ''
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    attached() {
      this.updateProgress();
    }
  },

  /**
   * 属性监听器
   */
  observers: {
    'value, target': function() {
      this.updateProgress();
    }
  },

  /**
   * 组件方法
   */
  methods: {
    /**
     * 更新进度
     */
    updateProgress() {
      const { value, target, animated } = this.properties;

      // 计算百分比
      let percentage = target > 0 ? (value / target) * 100 : 0;
      percentage = Math.min(Math.max(percentage, 0), 150); // 限制在0-150%

      // 确定状态
      let status = 'normal';
      let statusText = '';

      if (percentage >= 100) {
        status = 'completed';
        statusText = '已达标';
      } else if (percentage >= 80) {
        status = 'near';
        statusText = '接近目标';
      } else if (percentage >= 50) {
        status = 'progress';
        statusText = '进行中';
      } else if (percentage > 0) {
        status = 'low';
        statusText = '摄入不足';
      } else {
        status = 'empty';
        statusText = '未摄入';
      }

      // 动画效果
      if (animated) {
        this.animateProgress(percentage, value, status, statusText);
      } else {
        this.setData({
          percentage,
          displayValue: value,
          status,
          statusText
        });
      }
    },

    /**
     * 进度动画
     */
    animateProgress(targetPercentage, value, status, statusText) {
      const duration = 500;
      const steps = 30;
      const stepDuration = duration / steps;
      const startPercentage = this.data.percentage;
      const stepValue = (targetPercentage - startPercentage) / steps;

      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;

        if (currentStep >= steps) {
          clearInterval(timer);
          this.setData({
            percentage: targetPercentage,
            displayValue: value,
            status,
            statusText
          });
        } else {
          this.setData({
            percentage: startPercentage + stepValue * currentStep
          });
        }
      }, stepDuration);
    },

    /**
     * 点击事件
     */
    handleTap() {
      this.triggerEvent('tap', {
        value: this.properties.value,
        target: this.properties.target,
        percentage: this.data.percentage,
        status: this.data.status
      });
    }
  }
});

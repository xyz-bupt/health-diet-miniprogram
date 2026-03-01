/**
 * macro-ring.js - 宏量营养素环形图组件
 * 使用Canvas绘制环形进度图
 */
Component({
  /**
   * 组件属性
   */
  properties: {
    // 蛋白质
    protein: {
      type: Number,
      value: 0
    },
    // 碳水化合物
    carbs: {
      type: Number,
      value: 0
    },
    // 脂肪
    fat: {
      type: Number,
      value: 0
    },
    // 尺寸
    size: {
      type: Number,
      value: 200
    },
    // 线条宽度
    lineWidth: {
      type: Number,
      value: 20
    },
    // 是否显示数值
    showValue: {
      type: Boolean,
      value: true
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
    proteinPercent: 0,
    carbsPercent: 0,
    fatPercent: 0,
    total: 0
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    attached() {
      this.initChart();
    }
  },

  /**
   * 属性监听器
   */
  observers: {
    'protein, carbs, fat': function() {
      this.initChart();
    }
  },

  /**
   * 组件方法
   */
  methods: {
    /**
     * 初始化图表
     */
    initChart() {
      const { protein, carbs, fat } = this.properties;
      const total = protein + carbs + fat;

      // 计算各部分百分比
      const proteinPercent = total > 0 ? (protein / total) * 100 : 0;
      const carbsPercent = total > 0 ? (carbs / total) * 100 : 0;
      const fatPercent = total > 0 ? (fat / total) * 100 : 0;

      this.setData({
        proteinPercent,
        carbsPercent,
        fatPercent,
        total
      });

      // 绘制图表
      if (this.properties.animated) {
        this.drawAnimated();
      } else {
        this.draw(1);
      }
    },

    /**
     * 绘制图表（带动画）
     */
    drawAnimated() {
      const duration = 800;
      const frames = 40;
      const stepDuration = duration / frames;
      let currentFrame = 0;

      const animate = () => {
        currentFrame++;
        const progress = currentFrame / frames;

        // 使用缓动函数
        const easeProgress = this.easeOutCubic(progress);

        this.draw(easeProgress);

        if (currentFrame < frames) {
          setTimeout(animate, stepDuration);
        }
      };

      animate();
    },

    /**
     * 缓动函数
     */
    easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    },

    /**
     * 绘制图表
     * @param {number} progress - 动画进度 0-1
     */
    draw(progress = 1) {
      const { size, lineWidth } = this.properties;
      const { proteinPercent, carbsPercent, fatPercent } = this.data;

      const ctx = wx.createCanvasContext('macro-ring-canvas', this);
      const centerX = size / 2;
      const centerY = size / 2;
      const radius = (size - lineWidth) / 2;

      // 清空画布
      ctx.clearRect(0, 0, size, size);

      // 绘制背景圆环
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.setStrokeStyle('#F0F0F0');
      ctx.setLineWidth(lineWidth);
      ctx.stroke();

      // 计算各部分的角度
      const proteinAngle = (proteinPercent / 100) * 2 * Math.PI * progress;
      const carbsAngle = (carbsPercent / 100) * 2 * Math.PI * progress;
      const fatAngle = (fatPercent / 100) * 2 * Math.PI * progress;

      // 绘制蛋白质（从-90度开始）
      let startAngle = -0.5 * Math.PI;
      this.drawArc(ctx, centerX, centerY, radius, startAngle, startAngle + proteinAngle, '#4ECDC4', lineWidth);

      // 绘制碳水化合物
      startAngle += proteinAngle;
      this.drawArc(ctx, centerX, centerY, radius, startAngle, startAngle + carbsAngle, '#FFE66D', lineWidth);

      // 绘制脂肪
      startAngle += carbsAngle;
      this.drawArc(ctx, centerX, centerY, radius, startAngle, startAngle + fatAngle, '#95E1D3', lineWidth);

      ctx.draw();
    },

    /**
     * 绘制圆弧
     */
    drawArc(ctx, x, y, radius, startAngle, endAngle, color, lineWidth) {
      if (endAngle <= startAngle) return;

      ctx.beginPath();
      ctx.arc(x, y, radius, startAngle, endAngle);
      ctx.setStrokeStyle(color);
      ctx.setLineWidth(lineWidth);
      ctx.setLineCap('round');
      ctx.stroke();
    }
  }
});

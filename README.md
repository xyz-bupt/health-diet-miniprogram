# 健康饮食微信小程序 (Health Diet WeChat Mini Program)

> 一个功能完整的健康饮食管理微信小程序，提供热量分析、营养追踪和健康食谱推荐功能。（纯前端，学习用品）

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 项目简介

这是一个基于微信小程序原生框架开发的健康管理应用，帮助用户科学管理饮食，追踪营养摄入，实现健康目标。

### 核心功能

- **营养分析**: 计算 BMI、BMR、TDEE 等健康指标
- **食物管理**: 200+ 种中国常见食物营养数据库
- **餐食记录**: 记录每日三餐，自动计算营养摄入
- **食谱推荐**: 30+ 道健康食谱，支持按难度、热量筛选
- **健康目标**: 支持减重、维持、增重三种目标的营养计划
- **AI饮食专家** ✨: 接入大模型 API，提供个性化食谱生成
  - 支持多种 AI 模型（DeepSeek、OpenAI、Claude、GPTDen、Moonshot 等）
  - 用户自行配置 API 密钥，安全可控
  - 智能生成一日/一周个性化食谱计划
  - 根据用户目标（减重/维持/增重）自动调整营养配比
  - 提供专业营养建议和食材用量指导

## 快速开始

### 环境要求

- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

### 运行项目

1. 克隆项目
```bash
git clone https://github.com/xyz-bupt/health-diet-miniprogram.git
cd health-diet-miniprogram
```

2. 在微信开发者工具中导入项目，选择 `miniprogram/` 作为项目根目录

3. 点击编译即可预览

## 项目结构

```
health-diet-miniprogram/
├── miniprogram/              # 小程序根目录
│   ├── pages/               # 页面
│   │   ├── index/           # 首页
│   │   ├── food-search/     # 食物搜索
│   │   ├── meal-record/     # 餐食记录
│   │   ├── recipe-list/     # 食谱列表
│   │   ├── ai-recipe/       # AI食谱生成 ✨
│   │   └── profile/         # 个人中心
│   ├── components/          # 组件
│   ├── data/                # 数据层（食物/食谱数据库）
│   ├── services/            # 服务层
│   │   ├── food-service.js
│   │   ├── recipe-service.js
│   │   └── ai-service.js    # AI服务 ✨
│   ├── utils/               # 工具层
│   │   ├── nutrition-calculator.js
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── ai-client.js     # AI客户端 ✨
│   ├── images/              # 资源文件
│   ├── app.js               # 应用入口
│   └── app.json             # 全局配置
└── project.config.json      # 项目配置
```

### 主要页面

| 页面 | 功能 |
|------|------|
| 首页 | 今日营养摄入概览、健康评分 |
| 食物搜索 | 搜索200+种食物、按分类筛选 |
| 餐食记录 | 记录每餐食物、计算营养 |
| 食谱列表 | 浏览30+道健康食谱、AI生成入口 |
| AI食谱 | AI生成个性化一日/一周食谱计划 |
| 个人中心 | 个人资料、BMI/TDEE计算、AI配置 |

## 技术栈

- 微信小程序原生框架
- JavaScript (CommonJS)
- WXSS (类似 CSS)
- WXML (类似 HTML)

## 数据说明

### 食物数据库
- 200+ 种中国常见食物
- 基于《中国食物成分表》
- 每100g可食部分营养成分含量

### 营养计算公式

| 指标 | 公式 |
|------|------|
| BMI | 体重 / 身高² |
| BMR(男) | 10×体重 + 6.25×身高 - 5×年龄 + 5 |
| BMR(女) | 10×体重 + 6.25×身高 - 5×年龄 - 161 |
| TDEE | BMR × 活动系数 |

## 开发指南

### 添加新食物

在 `miniprogram/data/food-database.js` 中添加：

```javascript
{
  id: '新ID',
  name: '食物名称',
  category: 'grains',
  subcategory: 'rice',
  calories: 100,
  protein: 3,
  carbs: 20,
  fat: 1,
  fiber: 2,
  unit: 'g',
  perUnit: 100
}
```

### 模块导入

本项目使用 **CommonJS** 格式（微信小程序要求）：

```javascript
// ✅ 正确
const { calculateBMI } = require('../../utils/nutrition-calculator.js');

// ❌ 错误
import { calculateBMI } from '../../utils/nutrition-calculator.js';
```

## 截图

> TODO: 添加小程序截图

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

[MIT License](LICENSE)

## 联系方式

- 作者: xyz-bupt
- 邮箱: xyz2005@bupt.edu.cn

## 参考资料

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [中国食物成分表](https://www.cnsoc.org/)

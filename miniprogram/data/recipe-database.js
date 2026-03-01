/**
 * recipe-database.js - 健康食谱数据库
 * 包含适合中国饮食习惯的健康食谱
 *
 * 修复说明：
 * - 转换为 CommonJS 格式以兼容微信小程序
 * - 使用 module.exports
 */

// 早餐食谱
const breakfast = [
  {
    id: 'rb001',
    name: '牛奶燕麦粥',
    category: 'breakfast',
    tags: ['高蛋白', '高纤维', '快手'],
    time: 10,
    difficulty: 'easy',
    servings: 1,
    image: '/images/recipe/oatmeal.png',
    description: '营养丰富的早餐，提供优质蛋白和膳食纤维',
    nutrition: {
      calories: 320,
      protein: 16,
      carbs: 45,
      fat: 9,
      fiber: 6
    },
    ingredients: [
      { foodId: 'g006', name: '燕麦片', amount: 50 },
      { foodId: 'd001', name: '牛奶', amount: 250 },
      { foodId: 'f003', name: '香蕉', amount: 50 }
    ],
    steps: [
      '将燕麦片放入碗中',
      '倒入牛奶，搅拌均匀',
      '放入微波炉加热2分钟',
      '香蕉切片，撒在粥上即可'
    ],
    tips: '可以加入少许坚果增加口感'
  },
  {
    id: 'rb002',
    name: '全麦鸡蛋三明治',
    category: 'breakfast',
    tags: ['高蛋白', '低碳水'],
    time: 15,
    difficulty: 'easy',
    servings: 1,
    image: '/images/recipe/sandwich.png',
    description: '经典早餐组合，蛋白质和碳水搭配均衡',
    nutrition: {
      calories: 380,
      protein: 22,
      carbs: 40,
      fat: 15,
      fiber: 4
    },
    ingredients: [
      { foodId: 'g007', name: '全麦面包', amount: 60 },
      { foodId: 'm010', name: '鸡蛋', amount: 50 },
      { foodId: 'v014', name: '番茄', amount: 50 },
      { foodId: 'v005', name: '生菜', amount: 20 }
    ],
    steps: [
      '鸡蛋煎至全熟',
      '番茄切片，生菜洗净',
      '全麦面包烤至微黄',
      '依次放上生菜、番茄、鸡蛋，盖上另一片面包'
    ],
    tips: '可以加一点低脂沙拉酱增加风味'
  },
  {
    id: 'rb003',
    name: '蔬菜鸡蛋饼',
    category: 'breakfast',
    tags: ['高蛋白', '高纤维'],
    time: 15,
    difficulty: 'easy',
    servings: 1,
    image: '/images/recipe/egg-pancake.png',
    description: '加入蔬菜的鸡蛋饼，营养更全面',
    nutrition: {
      calories: 240,
      protein: 18,
      carbs: 12,
      fat: 14,
      fiber: 2
    },
    ingredients: [
      { foodId: 'm010', name: '鸡蛋', amount: 100 },
      { foodId: 'v011', name: '胡萝卜', amount: 30 },
      { foodId: 'v002', name: '小白菜', amount: 30 },
      { foodId: 'c011', name: '盐', amount: 1 }
    ],
    steps: [
      '胡萝卜擦丝，小白菜切碎',
      '鸡蛋打散，加入蔬菜',
      '加入少许盐调味',
      '平底锅刷少量油，倒入蛋液摊成饼状'
    ],
    tips: '蔬菜可以随意搭配'
  },
  {
    id: 'rb004',
    name: '豆浆油条（改良版）',
    category: 'breakfast',
    tags: ['传统', '植物蛋白'],
    time: 20,
    difficulty: 'medium',
    servings: 1,
    image: '/images/recipe/soy-milk.png',
    description: '中式经典早餐，油条自制更健康',
    nutrition: {
      calories: 420,
      protein: 18,
      carbs: 55,
      fat: 16,
      fiber: 4
    },
    ingredients: [
      { foodId: 'd009', name: '豆浆', amount: 300 },
      { foodId: 'g008', name: '面粉', amount: 80 }
    ],
    steps: [
      '面粉加水和成面团，醒发30分钟',
      '面团擀成长条，切小块，两块叠加压一下',
      '油温180度炸至金黄',
      '配热豆浆食用'
    ],
    tips: '建议自制油条控制油量'
  },
  {
    id: 'rb005',
    name: '水果酸奶杯',
    category: 'breakfast',
    tags: ['快手', '低卡'],
    time: 5,
    difficulty: 'easy',
    servings: 1,
    image: '/images/recipe/yogurt-cup.png',
    description: '清爽快手，适合夏天食用',
    nutrition: {
      calories: 220,
      protein: 12,
      carbs: 35,
      fat: 4,
      fiber: 3
    },
    ingredients: [
      { foodId: 'd005', name: '低脂酸奶', amount: 200 },
      { foodId: 'f009', name: '草莓', amount: 80 },
      { foodId: 'f003', name: '香蕉', amount: 50 },
      { foodId: 'n006', name: '榛子', amount: 10 }
    ],
    steps: [
      '草莓洗净去蒂，香蕉切片',
      '在杯底铺一层酸奶',
      '放上水果，再加一层酸奶',
      '撒上碎坚果装饰'
    ],
    tips: '可以隔夜制作，早上直接吃'
  }
];

// 午餐食谱
const lunch = [
  {
    id: 'rl001',
    name: '香菇滑鸡饭',
    category: 'lunch',
    tags: ['高蛋白', '经典'],
    time: 40,
    difficulty: 'medium',
    servings: 2,
    image: '/images/recipe/chicken-rice.png',
    description: '经典广式家常菜，鸡肉嫩滑，香菇鲜美',
    nutrition: {
      calories: 520,
      protein: 38,
      carbs: 65,
      fat: 14,
      fiber: 3
    },
    ingredients: [
      { foodId: 'm007', name: '鸡胸肉', amount: 200 },
      { foodId: 'v025', name: '香菇', amount: 50 },
      { foodId: 'g002', name: '大米', amount: 150 },
      { foodId: 'v005', name: '生菜', amount: 50 }
    ],
    steps: [
      '鸡胸肉切片，用料酒、生抽腌制',
      '香菇泡发切片',
      '热锅少油，炒香鸡肉变色盛起',
      '香菇炒软，倒入鸡肉焖煮5分钟',
      '配上蒸好的米饭和生菜'
    ],
    tips: '鸡肉可以用淀粉上浆，口感更嫩'
  },
  {
    id: 'rl002',
    name: '西红柿炒鸡蛋',
    category: 'lunch',
    tags: ['经典', '家常'],
    time: 20,
    difficulty: 'easy',
    servings: 2,
    image: '/images/recipe/tomato-egg.png',
    description: '国民家常菜，酸甜可口，营养丰富',
    nutrition: {
      calories: 280,
      protein: 22,
      carbs: 15,
      fat: 18,
      fiber: 2
    },
    ingredients: [
      { foodId: 'm010', name: '鸡蛋', amount: 150 },
      { foodId: 'v014', name: '番茄', amount: 200 },
      { foodId: 'o005', name: '菜籽油', amount: 15 },
      { foodId: 'c001', name: '酱油', amount: 10 }
    ],
    steps: [
      '鸡蛋打散炒熟盛起',
      '番茄切块',
      '热锅少油，炒番茄出汁',
      '倒入鸡蛋翻炒均匀，加盐调味即可'
    ],
    tips: '番茄可以先用开水烫一下去皮'
  },
  {
    id: 'rl003',
    name: '清蒸鲈鱼',
    category: 'lunch',
    tags: ['高蛋白', '低脂'],
    time: 25,
    difficulty: 'medium',
    servings: 2,
    image: '/images/recipe/steamed-fish.png',
    description: '清淡鲜美，适合减脂期食用',
    nutrition: {
      calories: 220,
      protein: 40,
      carbs: 2,
      fat: 6,
      fiber: 0
    },
    ingredients: [
      { foodId: 's004', name: '鲈鱼', amount: 400 },
      { foodId: 'v005', name: '生姜', amount: 10 },
      { foodId: 'v005', name: '葱', amount: 20 }
    ],
    steps: [
      '鲈鱼洗净划刀，用盐和料酒腌制',
      '放姜片和葱段，大火蒸8-10分钟',
      '倒掉蒸汁，放葱丝',
      '淋热油和蒸鱼豉油即可'
    ],
    tips: '蒸制时间根据鱼大小调整'
  },
  {
    id: 'rl004',
    name: '麻婆豆腐',
    category: 'lunch',
    tags: ['经典', '素食'],
    time: 25,
    difficulty: 'medium',
    servings: 2,
    image: '/images/recipe/mapo-tofu.png',
    description: '经典川菜，麻辣鲜香',
    nutrition: {
      calories: 320,
      protein: 20,
      carbs: 15,
      fat: 22,
      fiber: 3
    },
    ingredients: [
      { foodId: 'b003', name: '豆腐', amount: 300 },
      { foodId: 'm004', name: '牛肉末', amount: 50 },
      { foodId: 'c005', name: '豆瓣酱', amount: 15 }
    ],
    steps: [
      '豆腐切块焯水',
      '牛肉末炒酥炒香',
      '加豆瓣酱炒出红油',
      '加水煮开放豆腐，勾芡即可'
    ],
    tips: '豆腐焯水可去豆腥味'
  },
  {
    id: 'rl005',
    name: '西兰花炒虾仁',
    category: 'lunch',
    tags: ['高蛋白', '低脂'],
    time: 20,
    difficulty: 'easy',
    servings: 2,
    image: '/images/recipe/shrimp-broccoli.png',
    description: '清爽健康，色彩搭配美观',
    nutrition: {
      calories: 240,
      protein: 32,
      carbs: 12,
      fat: 8,
      fiber: 4
    },
    ingredients: [
      { foodId: 's010', name: '虾仁', amount: 200 },
      { foodId: 'v008', name: '西兰花', amount: 200 },
      { foodId: 'o004', name: '橄榄油', amount: 10 }
    ],
    steps: [
      '虾仁用料酒、盐腌制',
      '西兰花切小朵焯水',
      '热锅少油，炒虾仁变色盛起',
      '放入西兰花翻炒，倒入虾仁，加盐调味即可'
    ],
    tips: '西兰花焯水时间不要太长'
  },
  {
    id: 'rl006',
    name: '土豆红烧肉',
    category: 'lunch',
    tags: ['经典', '下饭'],
    time: 60,
    difficulty: 'medium',
    servings: 4,
    image: '/images/recipe/pork-potato.png',
    description: '经典家常菜，肥而不腻',
    nutrition: {
      calories: 450,
      protein: 18,
      carbs: 35,
      fat: 28,
      fiber: 2
    },
    ingredients: [
      { foodId: 'm002', name: '五花肉', amount: 300 },
      { foodId: 'v011', name: '土豆', amount: 200 },
      { foodId: 'c008', name: '冰糖', amount: 20 }
    ],
    steps: [
      '五花肉切块焯水',
      '土豆切滚刀块',
      '炒糖色，放入五花肉翻炒',
      '加水炖煮30分钟，放入土豆继续炖15分钟'
    ],
    tips: '炒糖色注意火候，避免炒糊'
  }
];

// 晚餐食谱
const dinner = [
  {
    id: 'rd001',
    name: '清炒时蔬',
    category: 'dinner',
    tags: ['低卡', '高纤维'],
    time: 15,
    difficulty: 'easy',
    servings: 2,
    image: '/images/recipe/stir-fry-veg.png',
    description: '清爽健康，适合晚餐',
    nutrition: {
      calories: 120,
      protein: 4,
      carbs: 18,
      fat: 4,
      fiber: 6
    },
    ingredients: [
      { foodId: 'v002', name: '小白菜', amount: 200 },
      { foodId: 'v015', name: '胡萝卜', amount: 50 },
      { foodId: 'o004', name: '橄榄油', amount: 8 }
    ],
    steps: [
      '小白菜洗净切段',
      '胡萝卜切片',
      '热锅少油，先炒胡萝卜',
      '放入小白菜大火快炒，调味即可'
    ],
    tips: '蔬菜炒制时间不宜过长'
  },
  {
    id: 'rd002',
    name: '番茄豆腐汤',
    category: 'dinner',
    tags: ['清淡', '低卡'],
    time: 20,
    difficulty: 'easy',
    servings: 2,
    image: '/images/recipe/tofu-soup.png',
    description: '开胃爽口，热量很低',
    nutrition: {
      calories: 140,
      protein: 10,
      carbs: 12,
      fat: 7,
      fiber: 2
    },
    ingredients: [
      { foodId: 'v014', name: '番茄', amount: 150 },
      { foodId: 'b003', name: '豆腐', amount: 200 },
      { foodId: 'v005', name: '生菜', amount: 50 }
    ],
    steps: [
      '番茄去皮切小块',
      '豆腐切块',
      '热锅炒番茄出汁，加水煮开',
      '放入豆腐煮5分钟，加盐和生菜即可'
    ],
    tips: '可以加一点紫菜增加鲜味'
  },
  {
    id: 'rd003',
    name: '白灼菜心',
    category: 'dinner',
    tags: ['清淡', '快手'],
    time: 10,
    difficulty: 'easy',
    servings: 2,
    image: '/images/recipe/choy-sum.png',
    description: '简单原味，保留蔬菜本味',
    nutrition: {
      calories: 60,
      protein: 3,
      carbs: 8,
      fat: 2,
      fiber: 2
    },
    ingredients: [
      { foodId: 'v004', name: '油菜', amount: 300 },
      { foodId: 'c001', name: '生抽', amount: 10 }
    ],
    steps: [
      '油菜洗净沥干',
      '水烧开加少许盐',
      '放入油菜焯烫30秒',
      '取出沥干，淋上生抽'
    ],
    tips: '焯烫时间不宜过长'
  },
  {
    id: 'rd004',
    name: '凉拌黄瓜',
    category: 'dinner',
    tags: ['清爽', '低卡'],
    time: 10,
    difficulty: 'easy',
    servings: 2,
    image: '/images/recipe/cucumber-salad.png',
    description: '清爽开胃，夏日必备',
    nutrition: {
      calories: 80,
      protein: 2,
      carbs: 8,
      fat: 5,
      fiber: 2
    },
    ingredients: [
      { foodId: 'v015', name: '黄瓜', amount: 300 },
      { foodId: 'o006', name: '芝麻油', amount: 5 },
      { foodId: 'c011', name: '盐', amount: 2 }
    ],
    steps: [
      '黄瓜洗净拍碎切小块',
      '加盐腌制5分钟',
      '沥干水分',
      '加芝麻油拌匀即可'
    ],
    tips: '可以加大蒜和醋调味'
  },
  {
    id: 'rd005',
    name: '清蒸蛋羹',
    category: 'dinner',
    tags: ['高蛋白', '嫩滑'],
    time: 20,
    difficulty: 'easy',
    servings: 1,
    image: '/images/recipe/steamed-egg.png',
    description: '口感嫩滑，老少皆宜',
    nutrition: {
      calories: 160,
      protein: 14,
      carbs: 3,
      fat: 11,
      fiber: 0
    },
    ingredients: [
      { foodId: 'm010', name: '鸡蛋', amount: 100 },
      { foodId: 'bev001', name: '温水', amount: 150 }
    ],
    steps: [
      '鸡蛋打散',
      '加入等量温水，搅拌均匀',
      '过筛去泡沫',
      '盖上保鲜膜，大火蒸10分钟'
    ],
    tips: '蛋液和水的比例是1:1，蒸出来最嫩'
  },
  {
    id: 'rd006',
    name: '紫菜蛋花汤',
    category: 'dinner',
    tags: ['清淡', '快手'],
    time: 10,
    difficulty: 'easy',
    servings: 2,
    image: '/images/recipe/seaweed-soup.png',
    description: '简单快手，营养丰富',
    nutrition: {
      calories: 100,
      protein: 8,
      carbs: 6,
      fat: 6,
      fiber: 1
    },
    ingredients: [
      { foodId: 'm010', name: '鸡蛋', amount: 100 },
      { foodId: 'v030', name: '紫菜', amount: 10 }
    ],
    steps: [
      '紫菜撕小块',
      '水烧开放入紫菜',
      '鸡蛋打散，淋入锅中',
      '加盐调味即可'
    ],
    tips: '可以加虾皮增加鲜味'
  }
];

// 加餐/小吃
const snacks = [
  {
    id: 'rs001',
    name: '水果坚果拼盘',
    category: 'snack',
    tags: ['健康', '快手'],
    time: 5,
    difficulty: 'easy',
    servings: 1,
    image: '/images/recipe/fruit-nuts.png',
    description: '健康的下午茶选择',
    nutrition: {
      calories: 200,
      protein: 4,
      carbs: 30,
      fat: 8,
      fiber: 4
    },
    ingredients: [
      { foodId: 'f001', name: '苹果', amount: 100 },
      { foodId: 'f009', name: '草莓', amount: 50 },
      { foodId: 'n003', name: '核桃', amount: 15 }
    ],
    steps: [
      '苹果切块',
      '草莓洗净',
      '摆盘即可'
    ],
    tips: '水果可以根据季节选择'
  },
  {
    id: 'rs002',
    name: '酸奶坚果杯',
    category: 'snack',
    tags: ['高蛋白', '健康'],
    time: 5,
    difficulty: 'easy',
    servings: 1,
    image: '/images/recipe/yogurt-nuts.png',
    description: '蛋白质丰富的健康小食',
    nutrition: {
      calories: 180,
      protein: 10,
      carbs: 15,
      fat: 9,
      fiber: 2
    },
    ingredients: [
      { foodId: 'd004', name: '酸奶', amount: 150 },
      { foodId: 'n003', name: '混合坚果', amount: 15 }
    ],
    steps: [
      '酸奶倒入杯中',
      '撒上坚果碎',
      '搅拌均匀即可'
    ],
    tips: '可以选择无糖酸奶更健康'
  },
  {
    id: 'rs003',
    name: '蒸紫薯',
    category: 'snack',
    tags: ['健康', '低脂'],
    time: 20,
    difficulty: 'easy',
    servings: 1,
    image: '/images/recipe/purple-potato.png',
    description: '天然甜味，健康饱腹',
    nutrition: {
      calories: 150,
      protein: 2,
      carbs: 35,
      fat: 0,
      fiber: 4
    },
    ingredients: [
      { foodId: 'g010', name: '紫薯', amount: 200 }
    ],
    steps: [
      '紫薯洗净',
      '上锅蒸20分钟至软烂',
      '去皮即可食用'
    ],
    tips: '可以蘸酸奶吃'
  },
  {
    id: 'rs004',
    name: '毛豆',
    category: 'snack',
    tags: ['高蛋白', '零食'],
    time: 15,
    difficulty: 'easy',
    servings: 2,
    image: '/images/recipe/edamame.png',
    description: '啤酒搭档，蛋白质丰富',
    nutrition: {
      calories: 180,
      protein: 15,
      carbs: 12,
      fat: 9,
      fiber: 5
    },
    ingredients: [
      { foodId: 'b008', name: '毛豆', amount: 200 }
    ],
    steps: [
      '毛豆洗净',
      '加水加盐煮10分钟',
      '捞出沥干即可'
    ],
    tips: '可以加点八角桂皮一起煮'
  }
];

// 素食食谱
const vegetarian = [
  {
    id: 'rv001',
    name: '宫保杏鲍菇',
    category: 'vegetarian',
    tags: ['素食', '经典'],
    time: 25,
    difficulty: 'medium',
    servings: 2,
    image: '/images/recipe/kungpao-mushroom.png',
    description: '素食版宫保鸡丁，口感丰富',
    nutrition: {
      calories: 200,
      protein: 8,
      carbs: 20,
      fat: 10,
      fiber: 6
    },
    ingredients: [
      { foodId: 'v027', name: '杏鲍菇', amount: 300 },
      { foodId: 'n003', name: '花生米', amount: 30 },
      { foodId: 'v017', name: '青椒', amount: 50 }
    ],
    steps: [
      '杏鲍菇切丁焯水',
      '花生米炸酥',
      '热锅少油，炒杏鲍菇',
      '加调料和花生米翻炒即可'
    ],
    tips: '杏鲍菇焯水可去腥味'
  },
  {
    id: 'rv002',
    name: '鱼香茄子',
    category: 'vegetarian',
    tags: ['素食', '经典'],
    time: 30,
    difficulty: 'medium',
    servings: 2,
    image: '/images/recipe/fish-eggplant.png',
    description: '川菜经典，素食也能做得好吃',
    nutrition: {
      calories: 240,
      protein: 4,
      carbs: 25,
      fat: 14,
      fiber: 4
    },
    ingredients: [
      { foodId: 'v016', name: '茄子', amount: 300 },
      { foodId: 'v017', name: '青椒', amount: 50 }
    ],
    steps: [
      '茄子切条，加盐腌制出水',
      '调鱼香汁：糖醋酱油料酒',
      '茄子过油或煎至软烂',
      '倒入鱼香汁，收汁即可'
    ],
    tips: '腌制过的茄子不容易吸油'
  },
  {
    id: 'rv003',
    name: '干煸四季豆',
    category: 'vegetarian',
    tags: ['素食', '经典'],
    time: 20,
    difficulty: 'medium',
    servings: 2,
    image: '/images/recipe/string-beans.png',
    description: '川菜经典，干香下饭',
    nutrition: {
      calories: 160,
      protein: 6,
      carbs: 18,
      fat: 8,
      fiber: 5
    },
    ingredients: [
      { foodId: 'v022', name: '四季豆', amount: 250 },
      { foodId: 'n011', name: '芝麻', amount: 5 }
    ],
    steps: [
      '四季豆摘段洗净',
      '少油干煸至表皮起皱',
      '加调料炒匀',
      '撒芝麻出锅'
    ],
    tips: '四季豆一定要炒熟'
  }
];

// 食谱数据库对象
const recipeDatabase = {
  breakfast,
  lunch,
  dinner,
  snacks,
  vegetarian,

  // 获取所有食谱
  getAllRecipes() {
    return [
      ...this.breakfast,
      ...this.lunch,
      ...this.dinner,
      ...this.snacks,
      ...this.vegetarian
    ];
  },

  // 根据ID获取食谱
  getRecipeById(id) {
    const allRecipes = this.getAllRecipes();
    return allRecipes.find(recipe => recipe.id === id);
  },

  // 根据分类获取食谱
  getRecipesByCategory(category) {
    if (this[category]) {
      return this[category];
    }
    return [];
  },

  // 根据标签搜索食谱
  getRecipesByTag(tag) {
    const allRecipes = this.getAllRecipes();
    return allRecipes.filter(recipe =>
      recipe.tags && recipe.tags.includes(tag)
    );
  },

  // 搜索食谱
  searchRecipes(keyword) {
    const allRecipes = this.getAllRecipes();
    if (!keyword) return allRecipes;

    const lowerKeyword = keyword.toLowerCase();
    return allRecipes.filter(recipe =>
      recipe.name.toLowerCase().includes(lowerKeyword) ||
      (recipe.description && recipe.description.toLowerCase().includes(lowerKeyword)) ||
      (recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(lowerKeyword)))
    );
  },

  // 根据热量范围获取食谱
  getRecipesByCalories(minCalories, maxCalories) {
    const allRecipes = this.getAllRecipes();
    return allRecipes.filter(recipe =>
      recipe.nutrition.calories >= minCalories &&
      recipe.nutrition.calories <= maxCalories
    );
  },

  // 获取食谱分类统计
  getCategoryStats() {
    return {
      breakfast: this.breakfast.length,
      lunch: this.lunch.length,
      dinner: this.dinner.length,
      snacks: this.snacks.length,
      vegetarian: this.vegetarian.length,
      total: this.getAllRecipes().length
    };
  }
};

// CommonJS 导出
module.exports = recipeDatabase;

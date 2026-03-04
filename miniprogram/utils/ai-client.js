/**
 * ai-client.js - AI大模型API客户端
 * 支持多种AI模型提供商
 *
 * 支持的提供商：
 * - Claude (Anthropic)
 * - OpenAI (GPT-4/GPT-3.5)
 * - DeepSeek
 * - GPTDen (GPTEnd/扣子)
 * - 自定义 (兼容OpenAI格式的API)
 */

/**
 * AI提供商配置
 */
const API_PROVIDERS = {
  claude: {
    name: 'Claude',
    baseUrl: 'https://api.anthropic.com/v1/messages',
    defaultModel: 'claude-3-5-sonnet-20241022',
    headers: {
      'anthropic-version': '2023-06-01'
    },
    format: 'claude'
  },
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1/chat/completions',
    defaultModel: 'gpt-4o-mini',
    headers: {},
    format: 'openai'
  },
  deepseek: {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1/chat/completions',
    defaultModel: 'deepseek-chat',
    headers: {},
    format: 'openai'
  },
  gptden: {
    name: 'GPTDen',
    baseUrl: 'https://api.gptden.com/v1/chat/completions',
    defaultModel: 'gpt-4o-mini',
    headers: {},
    format: 'openai'
  },
  moonshot: {
    name: 'Moonshot (月之暗面)',
    baseUrl: 'https://api.moonshot.cn/v1/chat/completions',
    defaultModel: 'moonshot-v1-8k',
    headers: {},
    format: 'openai'
  },
  custom: {
    name: '自定义',
    baseUrl: '',
    defaultModel: 'gpt-3.5-turbo',
    headers: {},
    format: 'openai'
  }
};

/**
 * AI客户端类
 */
class AIClient {
  constructor() {
    this.config = {
      provider: 'deepseek',
      apiKey: '',
      baseUrl: '',
      model: ''
    };
  }

  /**
   * 设置配置
   * @param {object} config - 配置对象
   */
  setConfig(config) {
    this.config = {
      ...this.config,
      ...config
    };

    // 如果使用自定义提供商，必须有baseUrl
    if (this.config.provider === 'custom' && config.baseUrl) {
      this.config.baseUrl = config.baseUrl;
    }
  }

  /**
   * 获取当前配置
   * @returns {object}
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * 获取提供商列表
   * @returns {array}
   */
  getProviders() {
    return Object.keys(API_PROVIDERS).map(key => ({
      key,
      name: API_PROVIDERS[key].name
    }));
  }

  /**
   * 获取提供商信息
   * @param {string} providerKey
   * @returns {object}
   */
  getProviderInfo(providerKey) {
    return API_PROVIDERS[providerKey] || API_PROVIDERS.custom;
  }

  /**
   * 构建营养师提示词
   * @param {object} userProfile - 用户档案
   * @param {number} dayCount - 天数 (1或7)
   * @returns {string}
   */
  buildPrompt(userProfile, dayCount) {
    const goalText = {
      lose: '减重（热量赤字，高蛋白低脂肪）',
      maintain: '维持体重（营养均衡）',
      gain: '增重（热量盈余，高碳水高蛋白）'
    };

    return `你是一位专业的营养师，请根据用户信息制定科学的${dayCount === 1 ? '一日' : '一周'}食谱计划。

【用户信息】
- 性别：${userProfile.gender === 'male' ? '男' : '女'}
- 年龄：${userProfile.age}岁
- 身高：${userProfile.height}cm
- 体重：${userProfile.weight}kg
- 健康目标：${goalText[userProfile.goal] || '维持体重'}
- 每日热量目标：${userProfile.dailyCalorieTarget || 2000}kcal
- 蛋白质目标：${userProfile.proteinTarget || 100}g
- 碳水目标：${userProfile.carbsTarget || 250}g
- 脂肪目标：${userProfile.fatTarget || 65}g

【要求】
1. 必须返回纯JSON格式，不要有任何其他文字说明
2. 每餐包含：菜名、主要食材(含用量)、简要制作步骤
3. 营养均衡，符合用户的健康目标和热量目标
4. 优先使用中国常见食材和烹饪方式
5. ${dayCount === 1 ? '只需返回一天的数据（早餐、午餐、晚餐、加餐）' : '返回7天的数据，每天包含早餐、午餐、晚餐、加餐'}

【JSON格式要求】
{
  "days": [
    {
      "date": "第1天",
      "meals": {
        "breakfast": {
          "name": "菜品名称",
          "calories": 400,
          "protein": 15,
          "carbs": 50,
          "fat": 12,
          "ingredients": ["食材1 100g", "食材2 50g"],
          "steps": ["步骤1", "步骤2"]
        },
        "lunch": { ... },
        "dinner": { ... },
        "snack": { ... }
      },
      "dailyTotal": {
        "calories": 2000,
        "protein": 100,
        "carbs": 250,
        "fat": 65
      }
    }
  ],
  "nutritionAdvice": "营养建议..."
}

请直接返回JSON，不要有其他内容。`;
  }

  /**
   * 解析AI响应
   * @param {string} responseText - AI返回的文本
   * @returns {object}
   */
  parseResponse(responseText) {
    try {
      // 尝试直接解析
      return JSON.parse(responseText);
    } catch (e) {
      // 尝试提取JSON部分
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('无法解析AI响应');
    }
  }

  /**
   * 调用Claude API
   * @param {string} prompt
   * @returns {Promise<string>}
   */
  async callClaude(prompt) {
    const provider = API_PROVIDERS.claude;

    return new Promise((resolve, reject) => {
      wx.request({
        url: provider.baseUrl,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
          ...provider.headers
        },
        data: {
          model: this.config.model || provider.defaultModel,
          max_tokens: 4096,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.content) {
            resolve(res.data.content[0].text);
          } else {
            reject(new Error(res.data.error?.message || '请求失败'));
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }

  /**
   * 调用OpenAI格式API（支持DeepSeek、GPTDen等）
   * @param {string} prompt
   * @returns {Promise<string>}
   */
  async callOpenAIFormat(prompt) {
    const provider = API_PROVIDERS[this.config.provider] || API_PROVIDERS.custom;
    const baseUrl = this.config.provider === 'custom' ? this.config.baseUrl : provider.baseUrl;

    return new Promise((resolve, reject) => {
      wx.request({
        url: baseUrl,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        data: {
          model: this.config.model || provider.defaultModel,
          messages: [
            {
              role: 'system',
              content: '你是一位专业的营养师，擅长根据用户需求制定科学健康的食谱计划。请严格按照用户要求的JSON格式返回结果。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4096
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.choices) {
            resolve(res.data.choices[0].message.content);
          } else {
            reject(new Error(res.data.error?.message || '请求失败'));
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }

  /**
   * 生成食谱计划
   * @param {object} userProfile - 用户档案
   * @param {number} dayCount - 天数
   * @returns {Promise<object>}
   */
  async generateMealPlan(userProfile, dayCount = 1) {
    if (!this.config.apiKey) {
      throw new Error('请先配置API密钥');
    }

    const prompt = this.buildPrompt(userProfile, dayCount);

    try {
      let responseText;

      // 根据提供商选择调用方式
      if (this.config.provider === 'claude') {
        responseText = await this.callClaude(prompt);
      } else {
        responseText = await this.callOpenAIFormat(prompt);
      }

      // 解析响应
      const result = this.parseResponse(responseText);

      return {
        success: true,
        data: result,
        provider: this.config.provider
      };
    } catch (error) {
      console.error('AI生成食谱失败:', error);
      return {
        success: false,
        error: error.message || '生成失败，请检查API配置'
      };
    }
  }

  /**
   * 测试API连接
   * @returns {Promise<object>}
   */
  async testConnection() {
    if (!this.config.apiKey) {
      return {
        success: false,
        error: 'API密钥未配置'
      };
    }

    try {
      const testPrompt = '请回复"连接成功"，不要有其他内容。';
      let responseText;

      if (this.config.provider === 'claude') {
        responseText = await this.callClaude(testPrompt);
      } else {
        responseText = await this.callOpenAIFormat(testPrompt);
      }

      return {
        success: true,
        message: '连接成功'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || '连接失败'
      };
    }
  }
}

// 导出单例
module.exports = new AIClient();

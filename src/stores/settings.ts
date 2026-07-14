import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', () => {
  // API Key 配置
  const apiKey = ref('')
  const apiUrl = ref('https://api.openai.com/v1')
  const modelName = ref('gpt-4o-mini')
  const isConfigured = computed(() => apiKey.value.trim().length > 0)

  // 支持的模型预设
  const modelPresets = [
    { name: 'GPT-4o Mini', value: 'gpt-4o-mini', url: 'https://api.openai.com/v1', label: 'OpenAI - 快速经济' },
    { name: 'GPT-4o', value: 'gpt-4o', url: 'https://api.openai.com/v1', label: 'OpenAI - 强力推荐' },
    { name: 'DeepSeek Chat', value: 'deepseek-chat', url: 'https://api.deepseek.com/v1', label: 'DeepSeek - 中文优秀' },
    { name: 'DeepSeek Reasoner', value: 'deepseek-reasoner', url: 'https://api.deepseek.com/v1', label: 'DeepSeek - 深度思考' },
    { name: '通义千问-Max', value: 'qwen-max', url: 'https://dashscope.aliyuncs.com/compatible-mode/v1', label: '阿里云 - 通义千问' },
    { name: 'GLM-4-Flash', value: 'glm-4-flash', url: 'https://open.bigmodel.cn/api/paas/v4', label: '智谱AI - GLM-4' },
    { name: '自定义', value: 'custom', url: '', label: '自定义 API 地址' },
  ]

  // 从 localStorage 加载
  function loadSettings() {
    try {
      const saved = localStorage.getItem('happiness-settings')
      if (saved) {
        const data = JSON.parse(saved)
        apiKey.value = data.apiKey || ''
        apiUrl.value = data.apiUrl || 'https://api.openai.com/v1'
        modelName.value = data.modelName || 'gpt-4o-mini'
      }
    } catch {
      // 忽略加载错误
    }
  }

  // 保存到 localStorage
  function saveSettings() {
    try {
      localStorage.setItem(
        'happiness-settings',
        JSON.stringify({
          apiKey: apiKey.value,
          apiUrl: apiUrl.value,
          modelName: modelName.value,
        })
      )
    } catch (e) {
      console.error('保存设置失败:', e)
    }
  }

  // 更新 API Key
  function updateApiKey(key: string) {
    apiKey.value = key
    saveSettings()
  }

  // 更新 API URL
  function updateApiUrl(url: string) {
    apiUrl.value = url
    saveSettings()
  }

  // 更新模型名称
  function updateModelName(name: string) {
    modelName.value = name
    saveSettings()
  }

  // 应用预设
  function applyPreset(presetValue: string) {
    const preset = modelPresets.find((p) => p.value === presetValue)
    if (preset) {
      if (preset.value !== 'custom') {
        // 非自定义预设：自动设置模型名和 API 地址
        modelName.value = preset.value
        if (preset.url) {
          apiUrl.value = preset.url
        }
      }
      // 自定义模式不修改 modelName，让用户手动填写
      saveSettings()
    }
  }

  // 清除设置
  function clearSettings() {
    apiKey.value = ''
    apiUrl.value = 'https://api.openai.com/v1'
    modelName.value = 'gpt-4o-mini'
    localStorage.removeItem('happiness-settings')
  }

  // 初始化时加载
  loadSettings()

  return {
    apiKey,
    apiUrl,
   modelName,
    isConfigured,
    modelPresets,
    loadSettings,
    saveSettings,
    updateApiKey,
    updateApiUrl,
    updateModelName,
    applyPreset,
    clearSettings,
  }
})

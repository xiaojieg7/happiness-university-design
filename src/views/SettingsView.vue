<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Key, Sparkles, Check, Trash2, Eye, EyeOff,
  Save, AlertCircle, Heart, Brain, BookOpen, Shield, Cpu,
} from 'lucide-vue-next'
import { useSettingsStore } from '../stores/settings'

const settings = useSettingsStore()

const inputKey = ref(settings.apiKey)
const showKey = ref(false)
const isTesting = ref(false)
const testResult = ref<{ success: boolean; message: string } | null>(null)

const localUrl = ref(settings.apiUrl)
const localModel = ref(settings.modelName)

// 追踪当前选中的预设（用于高亮显示）
const selectedPreset = ref('')

function syncSelectedPreset() {
  // 检查当前 modelName 是否匹配某个预设
  const match = settings.modelPresets.find((p) => p.value === localModel.value)
  selectedPreset.value = match ? match.value : ''
}

syncSelectedPreset()

const hasChanges = computed(() => {
  return inputKey.value !== settings.apiKey ||
    localUrl.value !== settings.apiUrl ||
    localModel.value !== settings.modelName
})

function handleSave() {
  settings.updateApiKey(inputKey.value)
  settings.updateApiUrl(localUrl.value)
  settings.updateModelName(localModel.value)
  testResult.value = null
}

function handlePresetClick(preset: { name: string; value: string; url: string }) {
  selectedPreset.value = preset.value

  if (preset.value === 'custom') {
    // 自定义模式：不清空模型名，让用户自己填
    // 只设置 URL 为空让用户填写，保留当前模型名
    if (!localUrl.value || localUrl.value === '') {
      localUrl.value = 'https://'
    }
    // 聚焦模型名输入框让用户编辑
    const modelInput = document.getElementById('model-name-input')
    if (modelInput) {
      (modelInput as HTMLInputElement).focus()
    }
  } else {
    // 预设模式：设置模型名和 URL
    localModel.value = preset.value
    localUrl.value = preset.url
  }
}

function handleClear() {
  if (confirm('确定要清除所有 API 配置吗？')) {
    settings.clearSettings()
    inputKey.value = ''
    localUrl.value = settings.apiUrl
    localModel.value = settings.modelName
    selectedPreset.value = ''
    testResult.value = null
  }
}

async function handleTest() {
  if (!inputKey.value.trim()) {
    testResult.value = { success: false, message: '请先输入 API Key' }
    return
  }
  if (!localModel.value.trim()) {
    testResult.value = { success: false, message: '请先输入模型名称' }
    return
  }
  if (!localUrl.value.trim()) {
    testResult.value = { success: false, message: '请先输入 API 地址' }
    return
  }

  isTesting.value = true
  testResult.value = null

  try {
    const url = localUrl.value.replace(/\/+$/, '')
    const response = await fetch(`${url}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${inputKey.value}`,
      },
      body: JSON.stringify({
        model: localModel.value,
        messages: [{ role: 'user', content: '你好，测试。回复"连接成功"即可。' }],
        max_tokens: 10,
      }),
    })

    if (response.ok) {
      const data = await response.json().catch(() => ({}))
      // 只要 HTTP 200 就视为连接成功，模型即使响应格式不同也无所谓
      // 因为有些模型（特别是第三方代理）的响应结构略有差异
      const content = data.choices?.[0]?.message?.content
        || data.choices?.[0]?.text
        || data.content
        || ''
      if (content) {
        testResult.value = {
          success: true,
          message: `连接成功！模型: ${localModel.value} | 响应示例: ${String(content).slice(0, 30)}`,
        }
      } else {
        // 200 但没有 content 字段，仍视为可连接（可能是结构差异）
        testResult.value = {
          success: true,
          message: `连接成功！模型: ${localModel.value} (HTTP 200，响应结构可能略有不同)`,
        }
      }
    } else {
      const errorData = await response.json().catch(() => ({}))
      const errMsg = errorData.error?.message || errorData.message || '未知错误'
      testResult.value = { success: false, message: `错误 ${response.status}: ${errMsg}` }
    }
  } catch (e: any) {
    testResult.value = { success: false, message: `网络错误: ${e.message || '无法连接'}` }
  } finally {
    isTesting.value = false
  }
}
</script>

<template>
  <div class="pt-24 pb-12 px-4">
    <div style="max-width: 56rem; margin-left: auto; margin-right: auto;">
      <!-- 标题栏 -->
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
        <router-link
          to="/"
          class="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105"
          style="
            background: rgba(255, 255, 255, 0.2);
            color: var(--color-text-secondary);
            text-decoration: none;
            border: none;
            cursor: pointer;
          "
        >
          返回首页
        </router-link>
        <h1
          style="font-size: 1.875rem; font-weight: 700; font-family: var(--font-heading); color: var(--color-text-primary);"
          class="text-3xl"
        >
          设置
        </h1>
      </div>

      <!-- API 配置卡片 -->
      <div class="glass p-6 md:p-8 mb-6">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;">
          <div
            style="
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 2.5rem;
              height: 2.5rem;
              border-radius: 0.75rem;
              background: linear-gradient(135deg, rgba(255, 107, 157, 0.2), rgba(192, 132, 252, 0.2));
            "
          >
            <Key :size="20" style="color: var(--color-primary)" />
          </div>
          <div>
            <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--color-text-primary);">AI 幸福设计师配置</h2>
            <p style="font-size: 0.875rem; color: var(--color-text-muted);">配置 OpenAI 兼容接口，启用智能日记评价</p>
          </div>
        </div>

        <!-- 状态指示 -->
        <div
          v-if="settings.isConfigured"
          class="flex items-center gap-2 p-3 rounded-xl mb-6"
          style="background: rgba(52, 211, 153, 0.1); border: 1px solid rgba(52, 211, 153, 0.2);"
        >
          <Check :size="16" style="color: var(--mood-hopeful);" />
          <span style="font-size: 0.875rem; color: var(--mood-hopeful);">
            已配置 · {{ settings.modelName }}
          </span>
        </div>

        <div
          v-else
          class="flex items-center gap-2 p-3 rounded-xl mb-6"
          style="background: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.2);"
        >
          <AlertCircle :size="16" style="color: var(--color-warm);" />
          <span style="font-size: 0.875rem; color: var(--color-warm);">未配置 · 将使用内置预设评价</span>
        </div>

        <!-- 模型预设选择 -->
        <div class="mb-5">
          <label style="display: block; font-size: 0.875rem; font-weight: 500; color: var(--color-text-secondary); margin-bottom: 0.5rem;">
            选择模型提供商（快速预设）
          </label>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            <button
              v-for="preset in settings.modelPresets"
              :key="preset.value"
              @click="handlePresetClick(preset)"
              style="
                padding: 0.5rem 1rem; border-radius: 0.75rem; font-size: 0.8rem;
                border: 1px solid transparent; cursor: pointer; transition: all 0.2s;
                font-family: var(--font-body);
              "
              :style="{
                background: selectedPreset === preset.value ? 'var(--color-primary)' : 'rgba(255,255,255,0.3)',
                color: selectedPreset === preset.value ? 'white' : 'var(--color-text-secondary)',
                borderColor: selectedPreset === preset.value ? 'var(--color-primary)' : 'rgba(255,255,255,0.3)',
              }"
            >
              {{ preset.name }}
            </button>
          </div>
          <p style="font-size: 0.75rem; color: var(--color-text-muted); margin-top: 0.375rem;">
            点击预设自动填充模型名和 API 地址，也可以直接在下方手动修改
          </p>
        </div>

        <!-- 模型名称输入框 -->
        <div class="mb-5">
          <label style="display: block; font-size: 0.875rem; font-weight: 500; color: var(--color-text-secondary); margin-bottom: 0.5rem;">
            <Cpu :size="14" style="display: inline; vertical-align: middle; margin-right: 0.25rem;" />
            模型名称
          </label>
          <input
            id="model-name-input"
            v-model="localModel"
            type="text"
            placeholder="例如: gpt-4o-mini, deepseek-chat, qwen-max..."
            class="input-glass"
            style="font-family: monospace;"
          />
          <p style="font-size: 0.75rem; color: var(--color-text-muted); margin-top: 0.375rem;">
            填写你的 API 支持的模型名称，如 <code style="background: rgba(255,255,255,0.2); padding: 0.1rem 0.3rem; border-radius: 0.25rem;">gpt-4o-mini</code>、<code style="background: rgba(255,255,255,0.2); padding: 0.1rem 0.3rem; border-radius: 0.25rem;">deepseek-chat</code> 等
          </p>
        </div>

        <!-- API URL -->
        <div class="mb-5">
          <label style="display: block; font-size: 0.875rem; font-weight: 500; color: var(--color-text-secondary); margin-bottom: 0.5rem;">API 地址</label>
          <input v-model="localUrl" type="text" placeholder="https://api.openai.com/v1" class="input-glass" />
          <p style="font-size: 0.75rem; color: var(--color-text-muted); margin-top: 0.375rem;">
            OpenAI 兼容接口地址（不含 /chat/completions 后缀）
          </p>
        </div>

        <!-- API Key -->
        <div class="mb-5">
          <label style="display: block; font-size: 0.875rem; font-weight: 500; color: var(--color-text-secondary); margin-bottom: 0.5rem;">API Key</label>
          <div style="position: relative;">
            <input
              v-model="inputKey"
              :type="showKey ? 'text' : 'password'"
              placeholder="sk-..."
              class="input-glass"
              style="padding-right: 3rem;"
            />
            <button
              @click="showKey = !showKey"
              style="
                position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%);
                background: none; border: none; cursor: pointer; color: var(--color-text-muted); padding: 0.25rem;
              "
            >
              <EyeOff v-if="!showKey" :size="16" />
              <Eye v-else :size="16" />
            </button>
          </div>
          <p style="font-size: 0.75rem; color: var(--color-text-muted); margin-top: 0.375rem;">
            API Key 仅存储在本地浏览器中，不会上传到任何服务器
          </p>
        </div>

        <!-- 当前配置预览 -->
        <div
          v-if="localModel || localUrl || inputKey"
          class="mb-5 p-4 rounded-xl"
          style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);"
        >
          <p style="font-size: 0.75rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">当前配置预览：</p>
          <div style="font-size: 0.8rem; color: var(--color-text-secondary); line-height: 1.8; font-family: monospace;">
            <div>模型: <span style="color: var(--color-primary);">{{ localModel || '(未设置)' }}</span></div>
            <div>地址: <span style="color: var(--color-primary);">{{ localUrl || '(未设置)' }}</span></div>
            <div>Key: <span style="color: var(--color-primary);">{{ inputKey ? '✓ 已输入' : '✗ 未输入' }}</span></div>
          </div>
        </div>

        <!-- 测试结果 -->
        <div
          v-if="testResult"
          class="mb-5 p-3 rounded-xl text-sm"
          :style="{ background: testResult.success ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)', color: testResult.success ? 'var(--mood-hopeful)' : '#EF4444' }"
        >
          {{ testResult.message }}
        </div>

        <!-- 操作按钮 -->
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button class="btn-glass" :disabled="!hasChanges" :style="{ opacity: hasChanges ? 1 : 0.5 }" @click="handleSave">
            <Save :size="16" /> 保存配置
          </button>
          <button class="btn-glass-secondary" :disabled="isTesting || !inputKey.trim() || !localModel.trim()" @click="handleTest">
            <Sparkles :size="16" /> {{ isTesting ? '测试中...' : '测试连接' }}
          </button>
          <button
            v-if="settings.isConfigured"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
            style="background: rgba(239,68,68,0.1); color: #EF4444; border: none; cursor: pointer;"
            @click="handleClear"
          >
            <Trash2 :size="14" /> 清除
          </button>
        </div>
      </div>

      <!-- 记忆系统说明卡片 -->
      <div class="glass p-6 md:p-8 mb-6">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;">
          <div
            style="
              display: inline-flex; align-items: center; justify-content: center;
              width: 2.5rem; height: 2.5rem; border-radius: 0.75rem;
              background: linear-gradient(135deg, rgba(192,132,252,0.2), rgba(103,232,249,0.2));
            "
          >
            <Brain :size="20" style="color: var(--color-secondary)" />
          </div>
          <div>
            <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--color-text-primary);">幸福设计师的记忆系统</h2>
            <p style="font-size: 0.875rem; color: var(--color-text-muted);">AI 会记住你的特点，越用越懂你</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
          <div class="p-4 rounded-xl" style="background: rgba(255,107,157,0.08); border: 1px solid rgba(255,107,157,0.15);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <Heart :size="16" style="color: var(--color-primary);" />
              <span style="font-weight: 600; font-size: 0.9rem; color: var(--color-text-primary);">用户画像</span>
            </div>
            <p style="font-size: 0.8rem; color: var(--color-text-secondary); line-height: 1.6;">
              你的性格特点、兴趣话题、写作风格和情绪基线。每次回应都更贴合你。
            </p>
          </div>

          <div class="p-4 rounded-xl" style="background: rgba(192,132,252,0.08); border: 1px solid rgba(192,132,252,0.15);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <BookOpen :size="16" style="color: var(--color-secondary);" />
              <span style="font-weight: 600; font-size: 0.9rem; color: var(--color-text-primary);">对话上下文</span>
            </div>
            <p style="font-size: 0.8rem; color: var(--color-text-secondary); line-height: 1.6;">
              近期日记摘要、情绪趋势、持续话题。让对话连贯自然。
            </p>
          </div>

          <div class="p-4 rounded-xl" style="background: rgba(103,232,249,0.08); border: 1px solid rgba(103,232,249,0.15);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <Sparkles :size="16" style="color: var(--color-accent);" />
              <span style="font-weight: 600; font-size: 0.9rem; color: var(--color-text-primary);">长期模式</span>
            </div>
            <p style="font-size: 0.8rem; color: var(--color-text-secondary); line-height: 1.6;">
              情绪分布、高频关键词、幸福五维得分、成长里程碑。
            </p>
          </div>

          <div class="p-4 rounded-xl" style="background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.15);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <Shield :size="16" style="color: var(--color-warm);" />
              <span style="font-weight: 600; font-size: 0.9rem; color: var(--color-text-primary);">关系记忆</span>
            </div>
            <p style="font-size: 0.8rem; color: var(--color-text-secondary); line-height: 1.6;">
              信任度、个人细节引用、庆祝时刻。像真正的朋友一样记住你。
            </p>
          </div>
        </div>

        <div
          class="mt-5 p-4 rounded-xl text-sm"
          style="background: rgba(255,255,255,0.15); color: var(--color-text-secondary);"
        >
          所有记忆数据仅存储在你的浏览器本地（localStorage），不会上传到云端。
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Calendar, Lock, Sparkles, Loader2, Trash2, AlertCircle } from 'lucide-vue-next'
import { MOOD_MAP } from '../types/diary'
import { useDiaryStore } from '../stores/diary'
import AIEvaluation from '../components/diary/AIEvaluation.vue'
import PinVerify from '../components/diary/PinVerify.vue'

const router = useRouter()
const route = useRoute()
const store = useDiaryStore()

const images = ref<string[]>([])
const isGeneratingEvaluation = ref(false)
const evaluationError = ref('')

const diaryId = computed(() => route.params.id as string)
const diary = computed(() => store.getDiary(diaryId.value))
const moodConfig = computed(() => (diary.value ? MOOD_MAP[diary.value.mood] : null))

const formattedDate = computed(() => {
  if (!diary.value) return ''
  const date = new Date(diary.value.createdAt)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
})

const needsPinVerification = computed(() => {
  return diary.value?.isPrivate && !store.isUnlocked
})

onMounted(async () => {
  if (!diary.value) return
  if (diary.value.isPrivate && !store.isUnlocked) return

  // 加载图片
  for (const imageId of diary.value.imageIds) {
    const image = await store.getImage(imageId)
    if (image) {
      images.value.push(URL.createObjectURL(image.data))
    }
  }

  // 如果没有评价，尝试从 IndexedDB 加载
  if (!diary.value.aiEvaluation) {
    await store.loadEvaluation(diaryId.value)
  }
})

async function handleGenerateEvaluation() {
  if (!diary.value) return

  isGeneratingEvaluation.value = true
  evaluationError.value = ''
  try {
    const result = await store.generateAndSaveEvaluation(diaryId.value)
    if (!result) {
      evaluationError.value = '评价生成失败，请检查网络或 API 设置后重试'
    } else if (result.isFallback) {
      evaluationError.value = 'AI 暂时无法连接，已显示预设评价。请检查 API 配置后重试。'
    }
  } catch (e) {
    console.error('生成评价失败:', e)
    evaluationError.value = '评价生成失败：' + (e instanceof Error ? e.message : '未知错误')
  } finally {
    isGeneratingEvaluation.value = false
  }
}

function handleDelete() {
  if (confirm('确定要删除这篇日记吗？')) {
    store.deleteDiary(diaryId.value)
    router.push('/diary')
  }
}
</script>

<template>
  <div style="padding: 8rem 1rem 3rem 1rem;">
    <div style="max-width: 42rem; margin-left: auto; margin-right: auto;">
      <!-- 返回按钮 -->
      <button
        class="flex items-center gap-2 mb-6 px-4 py-2 rounded-xl transition-all hover:scale-105"
        style="
          background: rgba(255, 255, 255, 0.2);
          color: var(--color-text-secondary);
          border: none;
          cursor: pointer;
        "
        @click="router.push('/diary')"
      >
        <ArrowLeft :size="18" />
        返回日记列表
      </button>

      <!-- 需要 PIN 验证 -->
      <PinVerify v-if="needsPinVerification" />

      <!-- 日记内容 -->
      <template v-else-if="diary">
        <!-- 头部信息 -->
        <div class="mb-6">
          <div class="flex items-center gap-3 mb-4">
            <div
              class="flex items-center gap-1.5"
              style="color: var(--color-text-muted)"
            >
              <Calendar :size="16" />
              <span class="text-sm">{{ formattedDate }}</span>
            </div>
            <div
              v-if="moodConfig"
              class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm"
              style="
                background: color-mix(in srgb, v-bind('moodConfig.color') 15%, white 85%);
                color: v-bind('moodConfig.color');
              "
            >
              {{ moodConfig.emoji }} {{ moodConfig.label }}
            </div>
            <div
              v-if="diary.isPrivate"
              class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm"
              style="
                background: rgba(255, 107, 157, 0.1);
                color: var(--color-primary);
              "
            >
              <Lock :size="14" />
              私密
            </div>
          </div>

          <h1
            class="text-2xl font-bold"
            style="font-family: var(--font-heading); color: var(--color-text-primary)"
          >
            幸福日记
          </h1>
        </div>

        <!-- 日记正文 -->
        <div
          class="glass p-8 mb-6"
          style="white-space: pre-wrap; line-height: 1.8; color: var(--color-text-primary)"
        >
          {{ diary.content }}
        </div>

        <!-- 图片 -->
        <div v-if="images.length" class="flex flex-wrap gap-3 mb-6">
          <div
            v-for="(img, index) in images"
            :key="index"
            class="glass overflow-hidden"
            style="max-width: 300px"
          >
            <img :src="img" class="w-full h-auto" alt="日记图片" />
          </div>
        </div>

        <!-- AI 评价 -->
        <div v-if="diary.aiEvaluation" class="mb-6">
          <AIEvaluation :evaluation="diary.aiEvaluation" />

          <!-- 降级评价提示 + 重新生成按钮 -->
          <div v-if="diary.aiEvaluation.isFallback" style="margin-top: 0.75rem;">
            <div style="padding: 0.75rem 1rem; border-radius: 12px; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); display: flex; align-items: center; gap: 0.5rem; color: #d97706; font-size: 0.875rem; margin-bottom: 0.75rem;">
              <AlertCircle :size="16" />
              AI 暂时无法连接，以上为预设评价。配置好 API Key 后可重新生成真实评价。
            </div>
            <div v-if="evaluationError && !isGeneratingEvaluation" style="margin-bottom: 0.75rem; padding: 0.75rem 1rem; border-radius: 12px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); display: flex; align-items: center; gap: 0.5rem; color: #ef4444; font-size: 0.875rem;">
              <AlertCircle :size="16" />
              {{ evaluationError }}
            </div>
            <button
              class="btn-glass-secondary w-full"
              :disabled="isGeneratingEvaluation"
              @click="handleGenerateEvaluation"
            >
              <Loader2 v-if="isGeneratingEvaluation" :size="18" class="animate-spin" />
              <Sparkles v-else :size="18" />
              {{ isGeneratingEvaluation ? '幸福设计师正在阅读...' : '重新生成 AI 评价' }}
            </button>
          </div>
        </div>

        <!-- 生成评价按钮 -->
        <div v-else class="mb-6">
          <div v-if="evaluationError" style="margin-bottom: 0.75rem; padding: 0.75rem 1rem; border-radius: 12px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); display: flex; align-items: center; gap: 0.5rem; color: #ef4444; font-size: 0.875rem;">
            <AlertCircle :size="16" />
            {{ evaluationError }}
          </div>
          <button
            class="btn-glass-secondary w-full"
            :disabled="isGeneratingEvaluation"
            @click="handleGenerateEvaluation"
          >
            <Loader2 v-if="isGeneratingEvaluation" :size="18" class="animate-spin" />
            <Sparkles v-else :size="18" />
            {{ isGeneratingEvaluation ? '幸福设计师正在阅读...' : '让幸福设计师评价这篇日记' }}
          </button>
        </div>

        <!-- 删除按钮 -->
        <div class="text-center">
          <button
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all"
            style="
              background: rgba(255, 107, 157, 0.1);
              color: var(--color-primary);
              border: none;
              cursor: pointer;
              font-size: 0.875rem;
            "
            @click="handleDelete"
          >
            <Trash2 :size="14" />
            删除日记
          </button>
        </div>
      </template>

      <!-- 日记不存在 -->
      <div v-else class="glass p-12 text-center">
        <div class="text-4xl mb-4">😢</div>
        <h3
          class="text-lg font-semibold mb-2"
          style="font-family: var(--font-heading); color: var(--color-text-primary)"
        >
          日记不存在
        </h3>
        <p class="mb-6" style="color: var(--color-text-secondary)">
          可能已被删除或链接无效
        </p>
        <button class="btn-glass" @click="router.push('/diary')">
          返回日记列表
        </button>
      </div>
    </div>
  </div>
</template>

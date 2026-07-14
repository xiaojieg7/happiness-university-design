<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Save, Loader2, Calendar } from 'lucide-vue-next'
import type { MoodType, DiaryFormData } from '../types/diary'
import { useDiaryStore } from '../stores/diary'
import MoodSelector from '../components/diary/MoodSelector.vue'
import PrivacyToggle from '../components/diary/PrivacyToggle.vue'
import ImageUploader from '../components/diary/ImageUploader.vue'

const router = useRouter()
const store = useDiaryStore()

const content = ref('')
const mood = ref<MoodType>('happy')
const isPrivate = ref(false)
const images = ref<File[]>([])
const isSaving = ref(false)
const error = ref('')

const today = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
})

const isValid = computed(() => content.value.trim().length > 0)

async function handleSave() {
  if (!isValid.value) {
    error.value = '请输入日记内容'
    return
  }

  isSaving.value = true
  error.value = ''

  try {
    const formData: DiaryFormData = {
      content: content.value.trim(),
      mood: mood.value,
      isPrivate: isPrivate.value,
      images: images.value,
    }

    const entry = await store.saveDiary(formData)
    router.push(`/diary/${entry.id}`)
  } catch (e) {
    error.value = '保存失败，请重试'
    console.error(e)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div style="padding: 8rem 1rem 3rem 1rem;">
    <!-- 外层容器：负责水平居中 -->
    <div style="max-width: 42rem; margin-left: auto; margin-right: auto;">
      <!-- 返回按钮 -->
      <button
        style="
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          padding: 0.5rem 1rem;
          border-radius: 0.75rem;
          background: rgba(255, 255, 255, 0.2);
          color: var(--color-text-secondary);
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          font-family: var(--font-body);
        "
        @click="router.back()"
      >
        <ArrowLeft :size="18" />
        返回
      </button>

      <!-- 页面标题 -->
      <h1
        style="
          font-size: 1.875rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          font-family: var(--font-heading);
          color: var(--color-text-primary);
        "
      >
        写下今天的幸福时刻
      </h1>

      <!-- 日期 -->
      <div
        style="
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
          color: var(--color-text-muted);
        "
      >
        <Calendar :size="16" />
        <span style="font-size: 0.875rem;">{{ today }}</span>
      </div>

      <!-- 情绪选择 -->
      <div style="margin-bottom: 1.5rem;">
        <label
          style="
            display: block;
            font-size: 0.875rem;
            font-weight: 500;
            margin-bottom: 0.75rem;
            color: var(--color-text-secondary);
          "
        >
          选择今天的情绪
        </label>
        <MoodSelector v-model="mood" />
      </div>

      <!-- 隐私设置 -->
      <div style="margin-bottom: 1.5rem;">
        <PrivacyToggle v-model="isPrivate" />
      </div>

      <!-- 日记内容 -->
      <div style="margin-bottom: 1.5rem;">
        <label
          style="
            display: block;
            font-size: 0.875rem;
            font-weight: 500;
            margin-bottom: 0.75rem;
            color: var(--color-text-secondary);
          "
        >
          今天发生了什么让你感到幸福的事？
        </label>
        <textarea
          v-model="content"
          class="textarea-glass"
          rows="8"
          placeholder="写下你的感受..."
        />
      </div>

      <!-- 图片上传 -->
      <div style="margin-bottom: 2rem;">
        <label
          style="
            display: block;
            font-size: 0.875rem;
            font-weight: 500;
            margin-bottom: 0.75rem;
            color: var(--color-text-secondary);
          "
        >
          添加图片（可选）
        </label>
        <ImageUploader v-model="images" :max-images="3" />
      </div>

      <!-- 错误提示 -->
      <p v-if="error" style="font-size: 0.875rem; margin-bottom: 1rem; color: var(--color-primary-dark);">
        {{ error }}
      </p>

      <!-- 保存按钮 -->
      <button
        class="btn-glass"
        style="width: 100%; font-size: 1.125rem; padding: 1rem;"
        :disabled="!isValid || isSaving"
        :style="{ opacity: isValid ? 1 : 0.5 }"
        @click="handleSave"
      >
        <Loader2 v-if="isSaving" :size="20" class="animate-spin" />
        <Save v-else :size="20" />
        {{ isSaving ? '保存中...' : '保存日记' }}
      </button>
    </div>
  </div>
</template>

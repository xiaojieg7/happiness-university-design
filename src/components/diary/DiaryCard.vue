<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Lock, Calendar, Sparkles, Trash2 } from 'lucide-vue-next'
import type { DiaryEntry } from '../../types/diary'
import { MOOD_MAP } from '../../types/diary'
import { useDiaryStore } from '../../stores/diary'

const props = defineProps<{
  diary: DiaryEntry
}>()

const emit = defineEmits<{
  delete: [id: string]
}>()

const router = useRouter()
const store = useDiaryStore()

const thumbnails = ref<string[]>([])

const moodConfig = computed(() => MOOD_MAP[props.diary.mood])
const formattedDate = computed(() => {
  const date = new Date(props.diary.createdAt)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})
const previewText = computed(() => {
  const text = props.diary.content
  return text.length > 100 ? text.slice(0, 100) + '...' : text
})

onMounted(async () => {
  // 加载缩略图
  for (const imageId of props.diary.imageIds.slice(0, 3)) {
    const image = await store.getImage(imageId)
    if (image) {
      thumbnails.value.push(image.thumbnail)
    }
  }
})

function goToDetail() {
  router.push(`/diary/${props.diary.id}`)
}

function handleDelete(event: Event) {
  event.stopPropagation()
  if (confirm('确定要删除这篇日记吗？')) {
    emit('delete', props.diary.id)
  }
}
</script>

<template>
  <div
    class="glass glass-hover"
    style="
      padding: 1.5rem;
      border-radius: 20px;
      cursor: pointer;
      position: relative;
      transition: all 0.3s ease;
    "
    :style="{
      background: diary.isPrivate
        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(200, 200, 200, 0.1) 100%)'
        : undefined,
    }"
    @click="goToDetail"
  >
    <!-- 删除按钮 -->
    <button
      style="
        position: absolute;
        top: 1rem;
        right: 1rem;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        opacity: 0;
        transition: opacity 0.2s ease;
        background: rgba(255, 107, 157, 0.1);
        color: var(--color-primary);
        border: none;
        cursor: pointer;
      "
      class="delete-btn"
      @click="handleDelete"
    >
      <Trash2 :size="14" />
    </button>

    <!-- 头部：日期 + 情绪 + 隐私 -->
    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap;">
      <div style="display: flex; align-items: center; gap: 0.375rem; color: var(--color-text-muted); font-size: 0.875rem;">
        <Calendar :size="14" />
        <span>{{ formattedDate }}</span>
      </div>
      <div
        style="
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.625rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          background: v-bind('moodConfig.color')15;
          color: v-bind('moodConfig.color');
        "
      >
        {{ moodConfig.emoji }} {{ moodConfig.label }}
      </div>
      <div
        v-if="diary.isPrivate"
        style="
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.625rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          background: rgba(255, 107, 157, 0.1);
          color: var(--color-primary);
        "
      >
        <Lock :size="12" />
        私密
      </div>
    </div>

    <!-- 内容 -->
    <p
      style="
        color: var(--color-text-primary);
        line-height: 1.75;
        margin-bottom: 1rem;
        font-size: 1rem;
      "
      :class="{ 'blur-sm select-none': diary.isPrivate }"
    >
      {{ diary.isPrivate ? '••••••••••••••••••••' : previewText }}
    </p>

    <!-- 缩略图 -->
    <div v-if="thumbnails.length && !diary.isPrivate" style="display: flex; gap: 0.75rem; margin-bottom: 1rem;">
      <div
        v-for="(thumb, index) in thumbnails"
        :key="index"
        style="
          width: 72px;
          height: 72px;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.3);
          flex-shrink: 0;
        "
      >
        <img :src="thumb" style="width: 100%; height: 100%; object-fit: cover;" alt="" />
      </div>
    </div>

    <!-- AI 评价预览 -->
    <div
      v-if="diary.aiEvaluation && !diary.isPrivate"
      style="
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        padding: 0.875rem 1rem;
        border-radius: 14px;
        background: rgba(192, 132, 252, 0.08);
      "
    >
      <Sparkles :size="16" style="color: var(--color-secondary); flex-shrink: 0; margin-top: 2px;" />
      <p
        style="
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
          margin: 0;
        "
        class="line-clamp-2"
      >
        {{ diary.aiEvaluation.content.slice(0, 60) }}...
      </p>
    </div>
  </div>
</template>

<style scoped>
.delete-btn {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.glass:hover .delete-btn {
  opacity: 1;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

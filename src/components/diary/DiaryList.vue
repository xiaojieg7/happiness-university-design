<script setup lang="ts">
import { computed, ref } from 'vue'
import { Search, Filter, X } from 'lucide-vue-next'
import type { MoodType } from '../../types/diary'
import { MOOD_MAP } from '../../types/diary'
import { useDiaryStore } from '../../stores/diary'
import DiaryCard from './DiaryCard.vue'
import PinVerify from './PinVerify.vue'

const store = useDiaryStore()

const searchQuery = ref('')
const selectedMood = ref<MoodType | ''>('')
const showFilters = ref(false)
const searchFocused = ref(false)

const filteredDiaries = computed(() => {
  let diaries = store.visibleDiaries

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    diaries = diaries.filter((d) => d.content.toLowerCase().includes(query))
  }

  if (selectedMood.value) {
    diaries = diaries.filter((d) => d.mood === selectedMood.value)
  }

  return diaries
})

function handleDelete(id: string) {
  store.deleteDiary(id)
}

function clearFilters() {
  searchQuery.value = ''
  selectedMood.value = ''
}
</script>

<template>
  <div>
    <!-- 私密日记未解锁提示 -->
    <div
      v-if="store.privateCount > 0 && !store.isUnlocked"
      style="margin-bottom: 2rem;"
    >
      <PinVerify />
    </div>

    <!-- 搜索和筛选区域 -->
    <div style="margin-bottom: 2rem;">
      <!-- 搜索框 -->
      <div style="display: flex; gap: 0.75rem; margin-bottom: 1rem;">
        <div style="flex: 1; position: relative;">
          <Search
            :size="18"
            style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--color-text-muted);"
          />
          <input
            v-model="searchQuery"
            style="
              width: 100%;
              padding: 0.875rem 1rem 0.875rem 2.75rem;
              font-size: 1rem;
              border-radius: 16px;
              border: 1px solid rgba(255, 107, 157, 0.2);
              background: rgba(255, 255, 255, 0.4);
              backdrop-filter: blur(8px);
              color: var(--color-text-primary);
              font-family: var(--font-body);
              outline: none;
              transition: all 0.3s ease;
            "
            :style="{
              borderColor: searchQuery || searchFocused ? 'var(--color-primary)' : 'rgba(255, 107, 157, 0.2)',
              boxShadow: searchQuery || searchFocused ? '0 0 0 3px rgba(255, 107, 157, 0.15)' : 'none',
            }"
            placeholder="搜索日记内容..."
            @focus="searchFocused = true"
            @blur="searchFocused = false"
          />
          <button
            v-if="searchQuery"
            style="
              position: absolute;
              right: 0.75rem;
              top: 50%;
              transform: translateY(-50%);
              width: 24px;
              height: 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              border: none;
              background: rgba(255, 107, 157, 0.1);
              color: var(--color-text-muted);
              cursor: pointer;
            "
            @click="searchQuery = ''"
          >
            <X :size="14" />
          </button>
        </div>
        <button
          style="
            padding: 0.875rem 1rem;
            border-radius: 16px;
            border: 1px solid rgba(255, 107, 157, 0.2);
            background: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(8px);
            color: var(--color-text-secondary);
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          "
          :style="showFilters ? 'border-color: var(--color-primary); color: var(--color-primary);' : ''"
          @click="showFilters = !showFilters"
        >
          <Filter :size="18" />
        </button>
      </div>

      <!-- 情绪筛选 -->
      <transition name="slide">
        <div
          v-if="showFilters"
          style="
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
            padding: 1.25rem;
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.4);
          "
        >
          <button
            style="
              padding: 0.5rem 1rem;
              border-radius: 9999px;
              font-size: 0.875rem;
              border: 1px solid transparent;
              cursor: pointer;
              transition: all 0.2s ease;
              font-family: var(--font-body);
            "
            :style="{
              background: selectedMood === '' ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.5)',
              color: selectedMood === '' ? 'white' : 'var(--color-text-secondary)',
              boxShadow: selectedMood === '' ? '0 2px 8px rgba(255, 107, 157, 0.3)' : 'none',
            }"
            @click="selectedMood = ''"
          >
            全部
          </button>
          <button
            v-for="(config, key) in MOOD_MAP"
            :key="key"
            style="
              padding: 0.5rem 1rem;
              border-radius: 9999px;
              font-size: 0.875rem;
              border: 1px solid transparent;
              cursor: pointer;
              transition: all 0.2s ease;
              font-family: var(--font-body);
              display: inline-flex;
              align-items: center;
              gap: 0.375rem;
            "
            :style="{
              background: selectedMood === key ? config.color : 'rgba(255, 255, 255, 0.5)',
              color: selectedMood === key ? 'white' : 'var(--color-text-secondary)',
              boxShadow: selectedMood === key ? `0 2px 8px ${config.color}40` : 'none',
            }"
            @click="selectedMood = key as MoodType"
          >
            {{ config.emoji }} {{ config.label }}
          </button>
        </div>
      </transition>
    </div>

    <!-- 统计信息 -->
    <div
      v-if="filteredDiaries.length > 0"
      style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.5rem;
        padding: 0.75rem 1rem;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.2);
      "
    >
      <span style="font-size: 0.875rem; color: var(--color-text-secondary);">
        共 {{ filteredDiaries.length }} 篇日记
      </span>
      <button
        v-if="searchQuery || selectedMood"
        style="
          font-size: 0.8rem;
          color: var(--color-primary);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          transition: background 0.2s ease;
        "
        @click="clearFilters"
      >
        清除筛选
      </button>
    </div>

    <!-- 日记列表 -->
    <div v-if="filteredDiaries.length" style="display: flex; flex-direction: column; gap: 1.25rem;">
      <DiaryCard
        v-for="diary in filteredDiaries"
        :key="diary.id"
        :diary="diary"
        @delete="handleDelete"
      />
    </div>

    <!-- 空状态 -->
    <div
      v-else
      style="
        padding: 3rem 2rem;
        border-radius: 24px;
        text-align: center;
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.4);
      "
    >
      <div style="font-size: 3rem; margin-bottom: 1rem;">📝</div>
      <h3
        style="
          font-size: 1.125rem;
          font-weight: 600;
          font-family: var(--font-heading);
          color: var(--color-text-primary);
          margin: 0 0 0.5rem 0;
        "
      >
        {{ searchQuery || selectedMood ? '没有找到匹配的日记' : '还没有日记' }}
      </h3>
      <p style="color: var(--color-text-secondary); margin-bottom: 1.5rem;">
        {{ searchQuery || selectedMood ? '试试其他搜索条件' : '开始记录你的第一篇幸福日记吧' }}
      </p>
      <button
        v-if="searchQuery || selectedMood"
        style="
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 107, 157, 0.3);
          background: rgba(255, 255, 255, 0.3);
          color: var(--color-text-secondary);
          cursor: pointer;
          font-family: var(--font-body);
          transition: all 0.2s ease;
        "
        @click="clearFilters"
      >
        清除筛选
      </button>
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

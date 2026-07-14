<script setup lang="ts">
import type { MoodType } from '../../types/diary'
import { MOOD_MAP } from '../../types/diary'

const props = defineProps<{
  modelValue: MoodType
}>()

const emit = defineEmits<{
  'update:modelValue': [value: MoodType]
}>()

function selectMood(mood: MoodType) {
  emit('update:modelValue', mood)
}
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <button
      v-for="(config, key) in MOOD_MAP"
      :key="key"
      class="mood-btn"
      :class="{ active: modelValue === key }"
      :style="{
        '--mood-color': config.color,
      }"
      @click="selectMood(key as MoodType)"
    >
      <span class="text-xl">{{ config.emoji }}</span>
      <span class="text-sm font-medium">{{ config.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.mood-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--color-text-secondary);
  font-family: var(--font-body);
}

.mood-btn:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: translateY(-1px);
}

.mood-btn.active {
  background: var(--mood-color, var(--color-primary));
  background: color-mix(in srgb, var(--mood-color, var(--color-primary)) 20%, white 80%);
  border-color: var(--mood-color, var(--color-primary));
  color: var(--color-text-primary);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--mood-color, var(--color-primary)) 30%, transparent 70%);
}
</style>

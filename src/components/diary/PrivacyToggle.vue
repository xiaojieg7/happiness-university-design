<script setup lang="ts">
import { Lock, Eye } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function toggle() {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <div class="flex items-center gap-3">
    <span class="text-sm" style="color: var(--color-text-secondary)">隐私设置：</span>
    <button
      class="privacy-btn"
      :class="{ active: modelValue }"
      @click="toggle"
    >
      <Lock v-if="modelValue" :size="16" />
      <Eye v-else :size="16" />
      <span>{{ modelValue ? '私密' : '可见' }}</span>
    </button>
  </div>
</template>

<style scoped>
.privacy-btn {
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
  font-size: 0.875rem;
}

.privacy-btn:hover {
  background: rgba(255, 255, 255, 0.4);
}

.privacy-btn.active {
  background: rgba(255, 107, 157, 0.15);
  border-color: var(--color-primary-light);
  color: var(--color-primary);
}
</style>

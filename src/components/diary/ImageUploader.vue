<script setup lang="ts">
import { ref } from 'vue'
import { Camera, X } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: File[]
  maxImages?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: File[]]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const previews = ref<string[]>([])

const maxImages = props.maxImages || 3

function triggerUpload() {
  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files) return

  const newFiles = Array.from(target.files)
  const remaining = maxImages - props.modelValue.length
  const filesToAdd = newFiles.slice(0, remaining)

  for (const file of filesToAdd) {
    const reader = new FileReader()
    reader.onload = (e) => {
      previews.value.push(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  emit('update:modelValue', [...props.modelValue, ...filesToAdd])
  target.value = ''
}

function removeImage(index: number) {
  const newFiles = [...props.modelValue]
  newFiles.splice(index, 1)
  previews.value.splice(index, 1)
  emit('update:modelValue', newFiles)
}
</script>

<template>
  <div>
    <div class="flex flex-wrap gap-3">
      <!-- 已上传图片预览 -->
      <div
        v-for="(preview, index) in previews"
        :key="index"
        class="relative w-24 h-24 rounded-xl overflow-hidden group"
        style="
          background: rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.4);
        "
      >
        <img
          :src="preview"
          class="w-full h-full object-cover"
          alt="预览"
        />
        <button
          class="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style="background: rgba(0, 0, 0, 0.5); color: white"
          @click="removeImage(index)"
        >
          <X :size="14" />
        </button>
      </div>

      <!-- 上传按钮 -->
      <button
        v-if="modelValue.length < maxImages"
        class="w-24 h-24 rounded-xl flex flex-col items-center justify-center gap-1 transition-all hover:scale-105"
        style="
          background: rgba(255, 255, 255, 0.2);
          border: 2px dashed rgba(255, 107, 157, 0.3);
          color: var(--color-text-muted);
          cursor: pointer;
        "
        @click="triggerUpload"
      >
        <Camera :size="20" />
        <span class="text-xs">添加图片</span>
      </button>
    </div>

    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png,image/gif,image/webp"
      multiple
      class="hidden"
      @change="handleFileChange"
    />

    <p v-if="modelValue.length >= maxImages" class="text-xs mt-2" style="color: var(--color-text-muted)">
      最多上传 {{ maxImages }} 张图片
    </p>
  </div>
</template>

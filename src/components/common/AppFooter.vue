<script setup lang="ts">
import { Heart } from 'lucide-vue-next'
</script>

<template>
  <footer class="py-8 px-4 text-center">
    <div
      class="max-w-2xl mx-auto py-6 px-8 rounded-2xl"
      style="
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.2);
      "
    >
      <div class="flex items-center justify-center gap-2 mb-2">
        <Heart :size="16" style="color: var(--color-primary)" fill="currentColor" />
        <span
          class="font-semibold"
          style="font-family: var(--font-heading); color: var(--color-text-primary)"
        >
          幸福大学
        </span>
      </div>
      <p class="text-sm" style="color: var(--color-text-muted)">
        幸福是可以设计的，记录生活中的每一个美好瞬间
      </p>
    </div>
  </footer>
</template>

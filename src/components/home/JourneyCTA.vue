<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Heart, ArrowRight } from 'lucide-vue-next'

const router = useRouter()

function goToDiary() {
  router.push('/diary/new')
}
</script>

<template>
  <section style="padding: 6rem 1rem;">
    <!-- 外层容器：负责整体水平居中 -->
    <div style="max-width: 48rem; margin-left: auto; margin-right: auto; text-align: center;">
      <!-- 玻璃卡片容器 -->
      <div
        class="glass"
        style="
          padding: 3rem 2rem;
          position: relative;
          overflow: hidden;
          background: linear-gradient(
            135deg,
            rgba(255, 107, 157, 0.15) 0%,
            rgba(192, 132, 252, 0.15) 50%,
            rgba(103, 232, 249, 0.1) 100%
          );
        "
      >
        <!-- 背景光斑 -->
        <div
          style="
            position: absolute;
            width: 16rem;
            height: 16rem;
            border-radius: 50%;
            top: -5rem;
            right: -5rem;
            background: radial-gradient(circle, rgba(255, 107, 157, 0.2) 0%, transparent 70%);
            filter: blur(40px);
            pointer-events: none;
          "
        />
        <div
          style="
            position: absolute;
            width: 12rem;
            height: 12rem;
            border-radius: 50%;
            bottom: -3.75rem;
            left: -3.75rem;
            background: radial-gradient(circle, rgba(192, 132, 252, 0.2) 0%, transparent 70%);
            filter: blur(40px);
            pointer-events: none;
          "
        />

        <!-- 内容 -->
        <div style="position: relative; z-index: 10;">
          <div
            class="animate-pulse"
            style="
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 5rem;
              height: 5rem;
              margin-bottom: 2rem;
              border-radius: 50%;
              background: linear-gradient(135deg, rgba(255, 107, 157, 0.4) 0%, rgba(232, 69, 120, 0.4) 100%);
              border: 1px solid rgba(255, 255, 255, 0.4);
            "
          >
            <Heart :size="36" class="text-white" fill="currentColor" />
          </div>

          <h2
            style="
              font-size: 1.875rem;
              font-weight: 700;
              margin-bottom: 1.5rem;
              font-family: var(--font-heading);
              color: var(--color-text-primary);
            "
          >
            开始你的幸福旅程
          </h2>

          <p
            style="
              font-size: 1.125rem;
              margin-bottom: 2.5rem;
              max-width: 36rem;
              margin-left: auto;
              margin-right: auto;
              color: var(--color-text-secondary);
              line-height: 1.8;
            "
          >
            每一篇日记都是你与自己对话的珍贵时刻。
            现在就开始记录，让幸福成为你的生活方式。
          </p>

          <button class="btn-glass" style="font-size: 1.125rem; padding: 1rem 2.5rem;" @click="goToDiary">
            <Heart :size="20" />
            写下第一篇日记
            <ArrowRight :size="20" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

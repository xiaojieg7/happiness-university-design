<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Heart, ArrowDown } from 'lucide-vue-next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const router = useRouter()
const heroRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  // 标题动画
  if (titleRef.value) {
    gsap.from(titleRef.value, {
      opacity: 0,
      y: 60,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.3,
    })
  }

  // 副标题动画
  if (subtitleRef.value) {
    gsap.from(subtitleRef.value, {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power3.out',
      delay: 0.6,
    })
  }

  // CTA 动画
  if (ctaRef.value) {
    gsap.from(ctaRef.value, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.9,
    })
  }

  // 视差背景
  if (heroRef.value) {
    gsap.to(heroRef.value, {
      scrollTrigger: {
        trigger: heroRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.3,
      },
      y: 150,
      opacity: 0.3,
    })
  }
})

function goToDiary() {
  router.push('/diary/new')
}
</script>

<template>
  <section
    ref="heroRef"
    class="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
  >
    <!-- 背景装饰圆 -->
    <div
      class="absolute w-96 h-96 rounded-full opacity-20"
      style="
        top: 10%;
        right: 10%;
        background: radial-gradient(circle, var(--color-primary-light) 0%, transparent 70%);
        filter: blur(40px);
      "
    />
    <div
      class="absolute w-72 h-72 rounded-full opacity-15"
      style="
        bottom: 20%;
        left: 5%;
        background: radial-gradient(circle, var(--color-secondary) 0%, transparent 70%);
        filter: blur(50px);
      "
    />

    <!-- 主内容 -->
    <div class="relative z-10 text-center max-w-4xl mx-auto">
      <!-- 图标 -->
      <div
        class="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-full"
        style="
          background: linear-gradient(135deg, rgba(255, 107, 157, 0.3) 0%, rgba(192, 132, 252, 0.3) 100%);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.4);
        "
      >
        <Heart :size="36" style="color: var(--color-primary)" fill="currentColor" />
      </div>

      <!-- 标题 -->
      <h1
        ref="titleRef"
        class="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        style="font-family: var(--font-heading); color: var(--color-text-primary)"
      >
        幸福，是可以
        <span
          class="relative inline-block"
          style="color: var(--color-primary)"
        >
          设计
          <svg
            class="absolute -bottom-2 left-0 w-full"
            viewBox="0 0 200 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 8C50 2 150 2 198 8"
              stroke="var(--color-primary-light)"
              stroke-width="3"
              stroke-linecap="round"
            />
          </svg>
        </span>
        的
      </h1>

      <!-- 副标题 -->
      <p
        ref="subtitleRef"
        class="text-lg md:text-xl mb-10 max-w-2xl mx-auto"
        style="color: var(--color-text-secondary); line-height: 1.8"
      >
        幸福不是偶然发生的，而是可以通过有意识的设计思维来构建。
        <br class="hidden md:block" />
        记录生活中的美好时刻，让幸福成为一种习惯。
      </p>

      <!-- CTA -->
      <div ref="ctaRef" class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button class="btn-glass text-lg px-8 py-4" @click="goToDiary">
          <Heart :size="20" />
          开始记录幸福
        </button>
        <a
          href="#design-thinking"
          class="btn-glass-secondary text-lg px-8 py-4"
          style="text-decoration: none"
        >
          了解更多
        </a>
      </div>
    </div>

    <!-- 滚动提示 -->
    <div
      class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      style="color: var(--color-text-muted)"
    >
      <span class="text-sm">向下滚动</span>
      <ArrowDown :size="20" class="animate-bounce" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Lightbulb, Palette, Compass, Sparkles } from 'lucide-vue-next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)

const features = [
  {
    icon: Lightbulb,
    title: '觉察',
    description: '幸福始于觉察。当你开始注意生活中的小美好，幸福就已经在靠近。',
    gradient: 'linear-gradient(135deg, rgba(255, 107, 157, 0.15) 0%, rgba(255, 214, 232, 0.15) 100%)',
  },
  {
    icon: Palette,
    title: '设计',
    description: '像设计师一样思考，有意识地创造让自己感到幸福的环境和习惯。',
    gradient: 'linear-gradient(135deg, rgba(192, 132, 252, 0.15) 0%, rgba(240, 230, 255, 0.15) 100%)',
  },
  {
    icon: Compass,
    title: '行动',
    description: '幸福需要行动。每天一个小步骤，积累起来就是巨大的改变。',
    gradient: 'linear-gradient(135deg, rgba(103, 232, 249, 0.15) 0%, rgba(224, 255, 255, 0.15) 100%)',
  },
]

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion || !sectionRef.value) return

  gsap.from(sectionRef.value, {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 85%',
      once: true,
    },
  })
})
</script>

<template>
  <section id="design-thinking" class="py-24 px-4">
    <div style="max-width: 72rem; margin-left: auto; margin-right: auto;">
      <!-- 标题 -->
      <div ref="sectionRef" style="text-align: center; margin-bottom: 4rem;">
        <div
          style="
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 9999px;
            margin-bottom: 1.5rem;
            background: rgba(255, 107, 157, 0.1);
            border: 1px solid rgba(255, 107, 157, 0.2);
            color: var(--color-primary);
            font-size: 0.875rem;
            font-weight: 500;
          "
        >
          <Sparkles :size="16" />
          第一章
        </div>
        <h2
          style="
            font-size: 1.875rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            font-family: var(--font-heading);
            color: var(--color-text-primary);
          "
          class="md:text-5xl"
        >
          设计你的幸福
        </h2>
        <p
          style="
            font-size: 1.125rem;
            max-width: 42rem;
            margin-left: auto;
            margin-right: auto;
            color: var(--color-text-secondary);
          "
        >
          设计思维不仅适用于产品和建筑，它同样可以用来设计我们的生活。
          通过三个简单的步骤，你可以开始有意识地构建自己的幸福。
        </p>
      </div>

      <!-- 特性卡片 - 显式居中布局 -->
      <div
        style="
          display: flex;
          justify-content: center;
          align-items: stretch;
          gap: 1.5rem;
          max-width: 56rem;
          margin-left: auto;
          margin-right: auto;
        "
        class="flex-col sm:flex-row"
      >
        <div
          v-for="feature in features"
          :key="feature.title"
          class="glass glass-hover p-8 text-center"
          style="
            flex: 1 1 0%;
            max-width: 320px;
          "
          :style="{ background: feature.gradient }"
        >
          <div
            style="
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 4rem;
              height: 4rem;
              margin-bottom: 1.5rem;
              border-radius: 9999px;
              background: rgba(255, 255, 255, 0.4);
              border: 1px solid rgba(255, 255, 255, 0.5);
            "
          >
            <component :is="feature.icon" :size="28" style="color: var(--color-primary)" />
          </div>
          <h3
            style="
              font-size: 1.25rem;
              font-weight: 600;
              margin-bottom: 0.75rem;
              font-family: var(--font-heading);
              color: var(--color-text-primary);
            "
          >
            {{ feature.title }}
          </h3>
          <p style="color: var(--color-text-secondary); line-height: 1.7">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

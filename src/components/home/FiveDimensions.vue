<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Heart, Target, Users, Trophy, Brain } from 'lucide-vue-next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const titleRef = ref<HTMLElement | null>(null)

const dimensions = [
  {
    icon: Heart,
    title: '情感幸福',
    subtitle: 'Emotional Well-being',
    description: '体验积极情绪，如喜悦、感恩、平静和爱。学会在日常生活中感受和创造快乐。',
    color: 'var(--mood-happy)',
    bgGradient: 'linear-gradient(135deg, rgba(255, 217, 61, 0.15) 0%, rgba(255, 240, 150, 0.1) 100%)',
  },
  {
    icon: Target,
    title: '意义幸福',
    subtitle: 'Sense of Purpose',
    description: '找到生活的意义和目标。当你知道自己为什么而活，每一天都充满了动力。',
    color: 'var(--color-primary)',
    bgGradient: 'linear-gradient(135deg, rgba(255, 107, 157, 0.15) 0%, rgba(255, 180, 210, 0.1) 100%)',
  },
  {
    icon: Users,
    title: '关系幸福',
    subtitle: 'Social Connection',
    description: '建立和维护有意义的人际关系。爱与被爱，是人类最深层的幸福来源。',
    color: 'var(--color-secondary)',
    bgGradient: 'linear-gradient(135deg, rgba(192, 132, 252, 0.15) 0%, rgba(220, 200, 255, 0.1) 100%)',
  },
  {
    icon: Trophy,
    title: '成就幸福',
    subtitle: 'Sense of Achievement',
    description: '设定目标并实现它们。每一次成长和突破，都是幸福的积累。',
    color: 'var(--color-warm)',
    bgGradient: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(255, 230, 130, 0.1) 100%)',
  },
  {
    icon: Brain,
    title: '正念幸福',
    subtitle: 'Mindfulness',
    description: '活在当下，觉察此刻。正念让我们从焦虑中解脱，找到内心的平静。',
    color: 'var(--mood-calm)',
    bgGradient: 'linear-gradient(135deg, rgba(103, 232, 249, 0.15) 0%, rgba(200, 250, 255, 0.1) 100%)',
  },
]

// 第一行：前3张，第二行：后2张
const row1 = dimensions.slice(0, 3)
const row2 = dimensions.slice(3)

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion || !titleRef.value) return

  gsap.from(titleRef.value, {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: titleRef.value,
      start: 'top 85%',
      once: true,
    },
  })
})
</script>

<template>
  <section class="py-24 px-4">
    <div style="max-width: 72rem; margin-left: auto; margin-right: auto;">
      <!-- 标题 -->
      <div ref="titleRef" style="text-align: center; margin-bottom: 4rem;">
        <div
          style="
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 9999px;
            margin-bottom: 1.5rem;
            background: rgba(192, 132, 252, 0.1);
            border: 1px solid rgba(192, 132, 252, 0.2);
            color: var(--color-secondary);
            font-size: 0.875rem;
            font-weight: 500;
          "
        >
          <Heart :size="16" />
          第二章
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
          五维幸福模型
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
          幸福不是单一的维度，而是由五个相互关联的方面组成。
          当这五个维度达到平衡时，你会感受到真正的幸福。
        </p>
      </div>

      <!-- 第一行：3张卡片 -->
      <div
        style="
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        "
        class="flex-col sm:flex-row"
      >
        <div
          v-for="(dim, index) in row1"
          :key="dim.title"
          class="glass glass-hover p-8"
          style="
            flex: 1 1 0%;
            max-width: 320px;
            background: dim.bgGradient;
          "
          :style="{ background: dim.bgGradient }"
        >
          <div
            style="
              font-size: 3.75rem;
              font-weight: 700;
              margin-bottom: 1rem;
              opacity: 0.1;
              font-family: var(--font-accent);
              line-height: 1;
              color: dim.color;
            "
            :style="{ color: dim.color }"
          >
            {{ String(index + 1).padStart(2, '0') }}
          </div>
          <div
            style="
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 3.5rem;
              height: 3.5rem;
              margin-bottom: 1rem;
              border-radius: 9999px;
            "
            :style="{
              background: `${dim.color}20`,
              border: `1px solid ${dim.color}40`,
            }"
          >
            <component :is="dim.icon" :size="24" :style="{ color: dim.color }" />
          </div>
          <h3
            style="
              font-size: 1.25rem;
              font-weight: 600;
              margin-bottom: 0.25rem;
              font-family: var(--font-heading);
              color: var(--color-text-primary);
            "
          >
            {{ dim.title }}
          </h3>
          <p
            style="
              font-size: 0.875rem;
              margin-bottom: 0.75rem;
              color: var(--color-text-muted);
              font-style: italic;
            "
          >
            {{ dim.subtitle }}
          </p>
          <p style="color: var(--color-text-secondary); line-height: 1.7">
            {{ dim.description }}
          </p>
        </div>
      </div>

      <!-- 第二行：2张卡片 居中 -->
      <div
        style="
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        "
      >
        <div
          v-for="(dim, index) in row2"
          :key="dim.title"
          class="glass glass-hover p-8"
          style="
            flex: 0 0 auto;
            width: 100%;
            max-width: 320px;
          "
          :style="{ background: dim.bgGradient }"
        >
          <div
            style="
              font-size: 3.75rem;
              font-weight: 700;
              margin-bottom: 1rem;
              opacity: 0.1;
              font-family: var(--font-accent);
              line-height: 1;
            "
            :style="{ color: dim.color }"
          >
            {{ String(index + 4).padStart(2, '0') }}
          </div>
          <div
            style="
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 3.5rem;
              height: 3.5rem;
              margin-bottom: 1rem;
              border-radius: 9999px;
            "
            :style="{
              background: `${dim.color}20`,
              border: `1px solid ${dim.color}40`,
            }"
          >
            <component :is="dim.icon" :size="24" :style="{ color: dim.color }" />
          </div>
          <h3
            style="
              font-size: 1.25rem;
              font-weight: 600;
              margin-bottom: 0.25rem;
              font-family: var(--font-heading);
              color: var(--color-text-primary);
            "
          >
            {{ dim.title }}
          </h3>
          <p
            style="
              font-size: 0.875rem;
              margin-bottom: 0.75rem;
              color: var(--color-text-muted);
              font-style: italic;
            "
          >
            {{ dim.subtitle }}
          </p>
          <p style="color: var(--color-text-secondary); line-height: 1.7">
            {{ dim.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

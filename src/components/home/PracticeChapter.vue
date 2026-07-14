<script setup lang="ts">
import { Sparkles, Eye, TrendingUp } from 'lucide-vue-next'

const steps = [
  {
    icon: Sparkles,
    title: '练习',
    description: '每天记录一件让你感到幸福的事',
    color: 'var(--color-primary)',
  },
  {
    icon: Eye,
    title: '觉察',
    description: '开始注意生活中更多的美好时刻',
    color: 'var(--color-secondary)',
  },
  {
    icon: TrendingUp,
    title: '成长',
    description: '幸福成为一种自然的能力',
    color: 'var(--mood-hopeful)',
  },
]
</script>

<template>
  <section class="py-24 px-4">
    <div style="max-width: 64rem; margin-left: auto; margin-right: auto;">
      <!-- 标题 -->
      <div style="text-align: center; margin-bottom: 4rem;">
        <div
          style="
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 9999px;
            margin-bottom: 1.5rem;
            background: rgba(52, 211, 153, 0.1);
            border: 1px solid rgba(52, 211, 153, 0.2);
            color: var(--mood-hopeful);
            font-size: 0.875rem;
            font-weight: 500;
          "
        >
          <TrendingUp :size="16" />
          第三章
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
          幸福可以练习
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
          幸福不是一种天赋，而是一种可以培养的能力。
          就像锻炼身体一样，幸福也需要每天的练习。
        </p>
      </div>

      <!-- 进度轨道 -->
      <div style="position: relative; max-width: 56rem; margin-left: auto; margin-right: auto;">
        <!-- 连接线 (仅桌面端显示) -->
        <div
          class="hidden md:block"
          style="
            position: absolute;
            top: 3.5rem;
            left: 20%;
            right: 20%;
            height: 2px;
            background: linear-gradient(90deg, var(--color-primary-light) 0%, var(--color-secondary) 50%, var(--mood-hopeful) 100%);
            opacity: 0.3;
          "
        />

        <!-- 步骤卡片 - 显式居中布局 -->
        <div
          style="
            display: flex;
            justify-content: center;
            align-items: stretch;
            gap: 2rem;
          "
          class="flex-col sm:flex-row"
        >
          <div
            v-for="step in steps"
            :key="step.title"
            class="glass glass-hover p-8 text-center"
            style="
              position: relative;
              flex: 1 1 0%;
              max-width: 280px;
            "
          >
            <!-- 图标 -->
            <div
              style="
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 4rem;
                height: 4rem;
                margin: 0 auto 1.5rem;
                border-radius: 9999px;
              "
              :style="{
                background: `${step.color}20`,
                border: `2px solid ${step.color}40`,
              }"
            >
              <component :is="step.icon" :size="28" :style="{ color: step.color }" />
            </div>

            <!-- 内容 -->
            <h3
              style="
                font-size: 1.25rem;
                font-weight: 600;
                margin-bottom: 0.75rem;
                font-family: var(--font-heading);
                color: var(--color-text-primary);
              "
            >
              {{ step.title }}
            </h3>
            <p style="color: var(--color-text-secondary)">
              {{ step.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

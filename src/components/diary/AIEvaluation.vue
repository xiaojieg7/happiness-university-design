<script setup lang="ts">
import { computed } from 'vue'
import { Sparkles, Tag, TrendingUp } from 'lucide-vue-next'
import type { AIEvaluation, DimensionScore } from '../../types/diary'

const props = defineProps<{
  evaluation: AIEvaluation
}>()

// 圆环进度计算
const circumference = 2 * Math.PI * 52
const scoreOffset = computed(() => {
  const score = props.evaluation.happinessScore ?? 0
  return circumference - (score / 100) * circumference
})

// 分数颜色
const scoreColor = computed(() => {
  const score = props.evaluation.happinessScore ?? 0
  if (score >= 80) return '#22c55e'
  if (score >= 70) return '#84cc16'
  if (score >= 60) return '#eab308'
  if (score >= 50) return '#f97316'
  return '#ef4444'
})

const scoreLabel = computed(() => {
  const score = props.evaluation.happinessScore ?? 0
  if (score >= 85) return '幸福感满满'
  if (score >= 75) return '幸福感很好'
  if (score >= 65) return '幸福感不错'
  if (score >= 55) return '幸福感平稳'
  if (score >= 45) return '需要关注'
  return '需要关怀'
})

// 维度条最大宽度百分比
function barWidth(dim: DimensionScore): number {
  return Math.max(5, dim.score)
}

// 维度颜色
function dimColor(score: number): string {
  if (score >= 80) return 'linear-gradient(90deg, #22c55e, #4ade80)'
  if (score >= 70) return 'linear-gradient(90deg, #84cc16, #a3e635)'
  if (score >= 60) return 'linear-gradient(90deg, #eab308, #facc15)'
  if (score >= 50) return 'linear-gradient(90deg, #f97316, #fb923c)'
  return 'linear-gradient(90deg, #ef4444, #f87171)'
}
</script>

<template>
  <div
    class="glass relative overflow-hidden"
    style="
      padding: 2rem;
      border-radius: 24px;
      background: linear-gradient(135deg, rgba(192, 132, 252, 0.08) 0%, rgba(255, 107, 157, 0.08) 100%);
    "
  >
    <!-- 背景装饰 -->
    <div
      style="
        position: absolute;
        top: -30px;
        right: -30px;
        width: 140px;
        height: 140px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(192, 132, 252, 0.12) 0%, transparent 70%);
        filter: blur(25px);
        pointer-events: none;
      "
    />

    <div style="position: relative; z-index: 1;">
      <!-- 标题 -->
      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
        <div
          style="
            width: 36px; height: 36px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            background: linear-gradient(135deg, rgba(192, 132, 252, 0.25), rgba(255, 107, 157, 0.25));
          "
        >
          <Sparkles :size="18" style="color: var(--color-secondary)" />
        </div>
        <span
          style="font-weight: 600; font-size: 1.1rem; font-family: var(--font-heading); color: var(--color-text-primary);"
        >
          幸福设计师的评价
        </span>
      </div>

      <!-- 幸福指数仪表盘 -->
      <div
        v-if="evaluation.happinessScore !== undefined"
        style="
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          padding: 1.25rem;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.5);
        "
      >
        <!-- 圆环 -->
        <div style="position: relative; width: 120px; height: 120px; flex-shrink: 0;">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <!-- 背景圆环 -->
            <circle
              cx="60" cy="60" r="52"
              fill="none"
              stroke="rgba(255, 107, 157, 0.1)"
              :stroke-width="8"
            />
            <!-- 进度圆环 -->
            <circle
              cx="60" cy="60" r="52"
              fill="none"
              :stroke="scoreColor"
              :stroke-width="8"
              stroke-linecap="round"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="scoreOffset"
              transform="rotate(-90 60 60)"
              style="transition: stroke-dashoffset 1s ease, stroke 0.5s ease;"
            />
          </svg>
          <!-- 中心数字 -->
          <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <span style="font-size: 2rem; font-weight: 800; font-family: var(--font-heading); color: var(--color-text-primary); line-height: 1;">
              {{ evaluation.happinessScore }}
            </span>
            <span style="font-size: 0.7rem; color: var(--color-text-muted); margin-top: 2px;">幸福指数</span>
          </div>
        </div>

        <!-- 评级文字 -->
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 0.375rem; margin-bottom: 0.375rem;">
            <TrendingUp :size="16" :style="{ color: scoreColor }" />
            <span style="font-size: 1.15rem; font-weight: 700; font-family: var(--font-heading); color: var(--color-text-primary);">
              {{ scoreLabel }}
            </span>
          </div>
          <p v-if="evaluation.summary" style="font-size: 0.9rem; color: var(--color-text-secondary); line-height: 1.6; margin: 0;">
            {{ evaluation.summary }}
          </p>
        </div>
      </div>

      <!-- 五维评分 -->
      <div
        v-if="evaluation.dimensionScores?.length"
        style="margin-bottom: 1.5rem;"
      >
        <div style="display: flex; align-items: center; gap: 0.375rem; margin-bottom: 0.875rem;">
          <span style="font-size: 0.85rem; font-weight: 600; color: var(--color-text-secondary);">五维幸福评分</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div v-for="dim in evaluation.dimensionScores" :key="dim.name" style="display: flex; flex-direction: column; gap: 0.25rem;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 0.85rem; font-weight: 500; color: var(--color-text-primary);">{{ dim.name }}</span>
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-primary);">{{ dim.score }}</span>
            </div>
            <!-- 进度条 -->
            <div style="width: 100%; height: 8px; border-radius: 4px; background: rgba(255, 107, 157, 0.08); overflow: hidden;">
              <div
                :style="{
                  width: barWidth(dim) + '%',
                  height: '100%',
                  borderRadius: '4px',
                  background: dimColor(dim.score),
                  transition: 'width 0.8s ease',
                }"
              />
            </div>
            <!-- 点评 -->
            <span style="font-size: 0.78rem; color: var(--color-text-muted); line-height: 1.5;">
              {{ dim.comment }}
            </span>
          </div>
        </div>
      </div>

      <!-- 评价正文 -->
      <p style="margin: 0 0 1rem 0; line-height: 1.75; color: var(--color-text-primary); font-size: 1rem;">
        {{ evaluation.content }}
      </p>

      <!-- 关键词 -->
      <div v-if="evaluation.keywords?.length" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
        <span
          v-for="keyword in evaluation.keywords"
          :key="keyword"
          style="
            display: inline-flex; align-items: center; gap: 4px;
            padding: 0.25rem 0.75rem; border-radius: 999px;
            font-size: 0.8rem;
            background: rgba(255, 107, 157, 0.08);
            border: 1px solid rgba(255, 107, 157, 0.15);
            color: var(--color-primary);
          "
        >
          <Tag :size="10" />
          {{ keyword }}
        </span>
      </div>

      <!-- 鼓励语 -->
      <p
        v-if="evaluation.encouragement"
        style="margin: 0; font-size: 0.9rem; font-weight: 500; color: var(--color-primary);"
      >
        {{ evaluation.encouragement }}
      </p>
    </div>
  </div>
</template>

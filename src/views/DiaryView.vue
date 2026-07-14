<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import DiaryList from '../components/diary/DiaryList.vue'
import AppFooter from '../components/common/AppFooter.vue'

const router = useRouter()
</script>

<template>
  <div style="padding: 8rem 1rem 3rem 1rem;">
    <!-- 外层容器：负责水平居中 -->
    <div style="max-width: 48rem; margin-left: auto; margin-right: auto;">
      <!-- 页面标题区域 -->
      <div style="margin-bottom: 2.5rem;">
        <div style="display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h1
              style="
                font-size: 2rem;
                font-weight: 700;
                font-family: var(--font-heading);
                color: var(--color-text-primary);
                margin: 0 0 0.75rem 0;
                line-height: 1.2;
              "
            >
              我的幸福日记
            </h1>
            <p style="margin: 0; color: var(--color-text-secondary); font-size: 1.05rem; line-height: 1.6;">
              记录生活中的美好时刻，回顾成长的每一步
            </p>
          </div>
          <button
            class="btn-glass"
            style="
              padding: 0.875rem 1.5rem;
              font-size: 1rem;
              display: flex;
              align-items: center;
              gap: 0.5rem;
              flex-shrink: 0;
            "
            @click="router.push('/diary/new')"
          >
            <Plus :size="18" />
            写日记
          </button>
        </div>
      </div>

      <!-- 日记列表 -->
      <DiaryList />
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useDiaryStore } from './stores/diary'
import AppHeader from './components/common/AppHeader.vue'

const store = useDiaryStore()

onMounted(() => {
  store.init()
})
</script>

<template>
  <div class="app-container">
    <!-- 背景光斑装饰 -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div
        class="glow-orb"
        style="
          width: 600px;
          height: 600px;
          top: -200px;
          right: -100px;
          background: radial-gradient(circle, rgba(255, 107, 157, 0.3) 0%, transparent 70%);
        "
      />
      <div
        class="glow-orb"
        style="
          width: 500px;
          height: 500px;
          bottom: -150px;
          left: -100px;
          background: radial-gradient(circle, rgba(192, 132, 252, 0.25) 0%, transparent 70%);
        "
      />
      <div
        class="glow-orb"
        style="
          width: 400px;
          height: 400px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(103, 232, 249, 0.15) 0%, transparent 70%);
        "
      />
    </div>

    <!-- 导航栏 -->
    <AppHeader />

    <!-- 路由视图 -->
    <main class="relative z-10">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  position: relative;
  min-height: 100vh;
}
</style>

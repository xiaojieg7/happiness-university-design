<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Heart, BookOpen, Plus, Menu, X, Settings, Library } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const isMobileMenuOpen = ref(false)

function navigateTo(path: string) {
  router.push(path)
  isMobileMenuOpen.value = false
}

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 px-4 py-3"
    style="
      background: rgba(255, 240, 245, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.4);
    "
  >
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <!-- Logo -->
      <router-link
        to="/"
        class="flex items-center gap-2 text-decoration-none"
        style="color: var(--color-primary)"
      >
        <Heart :size="24" fill="currentColor" />
        <span
          class="text-xl font-semibold"
          style="font-family: var(--font-heading); color: var(--color-text-primary)"
        >
          幸福大学
        </span>
      </router-link>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-1">
        <button
          class="nav-link"
          :class="{ active: isActive('/') }"
          @click="navigateTo('/')"
        >
          <Heart :size="16" />
          首页
        </button>
        <button
          class="nav-link"
          :class="{ active: isActive('/diary') }"
          @click="navigateTo('/diary')"
        >
          <BookOpen :size="16" />
          幸福日记
        </button>
        <button
          class="nav-link"
          :class="{ active: isActive('/journal') }"
          @click="navigateTo('/journal')"
        >
          <Library :size="16" />
          <span class="hidden lg:inline">期刊专栏</span>
        </button>
        <button
          class="btn-glass text-sm"
          style="padding: 0.5rem 1rem"
          @click="navigateTo('/diary/new')"
        >
          <Plus :size="16" />
          写日记
        </button>
        <button
          class="nav-link"
          :class="{ active: isActive('/settings') }"
          @click="navigateTo('/settings')"
        >
          <Settings :size="16" />
          <span class="hidden lg:inline">设置</span>
        </button>
      </nav>

      <!-- Mobile Menu Button -->
      <button
        class="md:hidden p-2 rounded-lg"
        style="color: var(--color-text-primary)"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <X v-if="isMobileMenuOpen" :size="24" />
        <Menu v-else :size="24" />
      </button>
    </div>

    <!-- Mobile Nav -->
    <transition name="slide">
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden mt-3 p-4 rounded-xl"
        style="
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.4);
        "
      >
        <div class="flex flex-col gap-2">
          <button
            class="nav-link w-full justify-start"
            :class="{ active: isActive('/') }"
            @click="navigateTo('/')"
          >
            <Heart :size="16" />
            首页
          </button>
          <button
            class="nav-link w-full justify-start"
            :class="{ active: isActive('/diary') }"
            @click="navigateTo('/diary')"
          >
            <BookOpen :size="16" />
            幸福日记
          </button>
          <button
            class="nav-link w-full justify-start"
            :class="{ active: isActive('/journal') }"
            @click="navigateTo('/journal')"
          >
            <Library :size="16" />
            期刊专栏
          </button>
          <button
            class="btn-glass w-full text-sm"
            style="padding: 0.5rem 1rem"
            @click="navigateTo('/diary/new')"
          >
            <Plus :size="16" />
            写日记
          </button>
          <button
            class="nav-link w-full justify-start"
            :class="{ active: isActive('/settings') }"
            @click="navigateTo('/settings')"
          >
            <Settings :size="16" />
            设置
          </button>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-body);
}

.nav-link:hover {
  color: var(--color-primary);
  background: rgba(255, 107, 157, 0.1);
}

.nav-link.active {
  color: var(--color-primary);
  background: rgba(255, 107, 157, 0.15);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

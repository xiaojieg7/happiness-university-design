<script setup lang="ts">
import { ref, computed } from 'vue'
import { Sparkles, Heart, Palette, Brain, Users, BookOpen, Search, ArrowRight } from 'lucide-vue-next'
import JournalCard from '../components/journal/JournalCard.vue'
import AppFooter from '../components/common/AppFooter.vue'
import { articles, categories, type ArticleCategory } from '../data/journals'

const iconMap: Record<string, any> = {
  Sparkles,
  Heart,
  Palette,
  Brain,
  Users,
}

const activeCategory = ref<ArticleCategory | 'all'>('all')
const searchQuery = ref('')

const filteredArticles = computed(() => {
  let result = articles

  if (activeCategory.value !== 'all') {
    result = result.filter((a) => a.category === activeCategory.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    result = result.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.abstract.toLowerCase().includes(q) ||
        a.authors.some((author) => author.toLowerCase().includes(q)) ||
        a.keywords.some((kw) => kw.toLowerCase().includes(q)) ||
        a.journal.toLowerCase().includes(q),
    )
  }

  return result
})

const featuredArticles = computed(() => articles.filter((a) => a.featured))
</script>

<template>
  <div style="padding: 8rem 1rem 3rem 1rem;">
    <div style="max-width: 72rem; margin-left: auto; margin-right: auto;">

      <!-- Hero 区域 -->
      <div
        class="glass-accent"
        style="
          border-radius: var(--radius-xl);
          padding: 3rem 2rem;
          margin-bottom: 2.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        "
      >
        <div
          style="
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.375rem 1rem;
            border-radius: var(--radius-full);
            background: rgba(255, 107, 157, 0.15);
            border: 1px solid rgba(255, 107, 157, 0.2);
            font-size: 0.8rem;
            font-weight: 600;
            color: var(--color-primary-dark);
            margin-bottom: 1.25rem;
          "
        >
          <BookOpen :size="14" />
          <span>学术资源</span>
        </div>
        <h1
          style="
            font-size: clamp(1.75rem, 4vw, 2.5rem);
            font-weight: 700;
            font-family: var(--font-heading);
            color: var(--color-text-primary);
            margin: 0 0 0.75rem 0;
            line-height: 1.2;
          "
        >
          期刊专栏
        </h1>
        <p
          style="
            max-width: 36rem;
            margin: 0 auto;
            font-size: 1.05rem;
            line-height: 1.7;
            color: var(--color-text-secondary);
          "
        >
          汇集积极心理学、幸福学、设计与幸福领域的经典文献与前沿研究，
          为你的幸福设计实践提供科学根基
        </p>
      </div>

      <!-- 精选文章横幅 -->
      <div v-if="activeCategory === 'all' && !searchQuery" style="margin-bottom: 2.5rem;">
        <h2
          style="
            font-size: 1.25rem;
            font-weight: 700;
            font-family: var(--font-heading);
            color: var(--color-text-primary);
            margin: 0 0 1.25rem 0;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          "
        >
          <Sparkles :size="20" style="color: var(--color-primary);" />
          编辑精选
        </h2>
        <div
          style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
            gap: 1.5rem;
          "
        >
          <JournalCard
            v-for="article in featuredArticles.slice(0, 3)"
            :key="article.id"
            :article="article"
          />
        </div>
      </div>

      <!-- 分类筛选 + 搜索 -->
      <div
        class="glass"
        style="
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          margin-bottom: 2rem;
        "
      >
        <div
          style="
            display: flex;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap;
          "
        >
          <!-- 分类标签 -->
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; flex-grow: 1;">
            <button
              class="cat-tab"
              :class="{ 'cat-active': activeCategory === 'all' }"
              @click="activeCategory = 'all'"
            >
              全部
              <span class="cat-count">{{ articles.length }}</span>
            </button>
            <button
              v-for="cat in categories"
              :key="cat.key"
              class="cat-tab"
              :class="{ 'cat-active': activeCategory === cat.key }"
              @click="activeCategory = cat.key"
            >
              <component :is="iconMap[cat.icon]" :size="14" />
              {{ cat.label }}
              <span class="cat-count">{{ articles.filter((a) => a.category === cat.key).length }}</span>
            </button>
          </div>

          <!-- 搜索框 -->
          <div style="position: relative; min-width: 14rem;">
            <Search
              :size="16"
              style="
                position: absolute;
                left: 0.75rem;
                top: 50%;
                transform: translateY(-50%);
                color: var(--color-text-muted);
                pointer-events: none;
              "
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索文章、作者、关键词..."
              class="input-glass"
              style="padding-left: 2.25rem; font-size: 0.875rem; min-width: 14rem;"
            />
          </div>
        </div>

        <!-- 分类描述 -->
        <div v-if="activeCategory !== 'all'" style="margin-top: 0.875rem; padding-top: 0.875rem; border-top: 1px solid rgba(255, 255, 255, 0.3);">
          <p
            v-for="cat in categories"
            v-show="cat.key === activeCategory"
            :key="cat.key"
            style="font-size: 0.825rem; color: var(--color-text-secondary); margin: 0;"
          >
            {{ cat.description }}
          </p>
        </div>
      </div>

      <!-- 文章网格 -->
      <div v-if="filteredArticles.length > 0">
        <h2
          v-if="activeCategory !== 'all' || searchQuery"
          style="
            font-size: 1.125rem;
            font-weight: 600;
            font-family: var(--font-heading);
            color: var(--color-text-primary);
            margin: 0 0 1.25rem 0;
          "
        >
          {{ searchQuery ? `搜索结果（${filteredArticles.length}篇）` : '全部文章' }}
        </h2>
        <div
          style="
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(22rem, 1fr));
            gap: 1.5rem;
          "
        >
          <JournalCard
            v-for="article in filteredArticles"
            :key="article.id"
            :article="article"
          />
        </div>
      </div>

      <!-- 空状态 -->
      <div
        v-else
        class="glass"
        style="
          border-radius: var(--radius-lg);
          padding: 4rem 2rem;
          text-align: center;
        "
      >
        <Search :size="40" style="color: var(--color-text-muted); margin-bottom: 1rem;" />
        <p style="font-size: 1rem; color: var(--color-text-secondary); margin: 0 0 0.5rem 0;">
          没有找到匹配的文章
        </p>
        <p style="font-size: 0.875rem; color: var(--color-text-muted); margin: 0;">
          试试其他关键词或分类
        </p>
      </div>

      <!-- 底部引导 -->
      <div
        class="glass-accent"
        style="
          border-radius: var(--radius-xl);
          padding: 2.5rem;
          margin-top: 3rem;
          text-align: center;
        "
      >
        <h3
          style="
            font-size: 1.25rem;
            font-weight: 700;
            font-family: var(--font-heading);
            color: var(--color-text-primary);
            margin: 0 0 0.5rem 0;
          "
        >
          将研究融入生活
        </h3>
        <p
          style="
            max-width: 30rem;
            margin: 0 auto 1.5rem auto;
            font-size: 0.95rem;
            line-height: 1.6;
            color: var(--color-text-secondary);
          "
        >
          阅读这些文献后，不妨在幸福日记中记录你的思考与实践
        </p>
        <button class="btn-glass" @click="$router.push('/diary/new')">
          写一篇幸福日记
          <ArrowRight :size="18" />
        </button>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<style scoped>
.cat-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border-radius: var(--radius-full);
  font-size: 0.825rem;
  font-weight: 500;
  font-family: var(--font-body);
  color: var(--color-text-secondary);
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.cat-tab:hover {
  background: rgba(255, 107, 157, 0.1);
  color: var(--color-primary);
  border-color: rgba(255, 107, 157, 0.2);
}

.cat-active {
  background: linear-gradient(135deg, rgba(255, 107, 157, 0.7), rgba(232, 69, 120, 0.7)) !important;
  color: white !important;
  border-color: rgba(255, 255, 255, 0.4) !important;
  box-shadow: 0 4px 12px rgba(255, 107, 157, 0.3);
}

.cat-count {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.1rem 0.4rem;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.25);
}

.cat-active .cat-count {
  background: rgba(255, 255, 255, 0.35);
}
</style>

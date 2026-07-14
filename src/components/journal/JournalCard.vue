<script setup lang="ts">
import { ExternalLink, Star, Calendar, BookMarked } from 'lucide-vue-next'
import type { JournalArticle } from '../../data/journals'

const props = defineProps<{
  article: JournalArticle
}>()
</script>

<template>
  <a
    :href="props.article.url"
    target="_blank"
    rel="noopener noreferrer"
    class="journal-card glass glass-hover"
    style="text-decoration: none; color: inherit;"
  >
    <!-- Featured 标签 -->
    <div v-if="props.article.featured" class="featured-badge">
      <Star :size="12" fill="currentColor" />
      <span>精选</span>
    </div>

    <!-- 期刊来源 -->
    <div class="journal-meta">
      <BookMarked :size="14" />
      <span class="journal-name">{{ props.article.journal }}</span>
      <span class="journal-dot">·</span>
      <Calendar :size="13" />
      <span>{{ props.article.year }}</span>
      <span v-if="props.article.volume" class="journal-vol">{{ props.article.volume }}</span>
    </div>

    <!-- 文章标题 -->
    <h3 class="article-title">
      {{ props.article.title }}
    </h3>

    <!-- 作者 -->
    <div class="article-authors">
      <span v-for="(author, i) in props.article.authors" :key="i">
        {{ author }}<span v-if="i < props.article.authors.length - 1">, </span>
      </span>
    </div>

    <!-- 摘要 -->
    <p class="article-abstract">
      {{ props.article.abstract }}
    </p>

    <!-- 关键词 -->
    <div class="article-keywords">
      <span
        v-for="keyword in props.article.keywords"
        :key="keyword"
        class="keyword-tag"
      >
        {{ keyword }}
      </span>
    </div>

    <!-- 底部 -->
    <div class="article-footer">
      <span v-if="props.article.doi" class="article-doi">
        DOI: {{ props.article.doi }}
      </span>
      <span class="read-more">
        阅读原文
        <ExternalLink :size="14" />
      </span>
    </div>
  </a>
</template>

<style scoped>
.journal-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1.75rem;
  border-radius: var(--radius-lg);
  min-height: 20rem;
  overflow: hidden;
  cursor: pointer;
}

.featured-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  border-radius: var(--radius-full);
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #FF6B9D, #E84578);
  box-shadow: 0 2px 8px rgba(255, 107, 157, 0.3);
}

.journal-meta {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.875rem;
  flex-wrap: wrap;
}

.journal-name {
  font-weight: 600;
  color: var(--color-primary);
}

.journal-dot {
  color: var(--color-text-muted);
}

.journal-vol {
  color: var(--color-text-muted);
}

.article-title {
  font-size: 1.125rem;
  font-weight: 700;
  font-family: var(--font-heading);
  color: var(--color-text-primary);
  line-height: 1.4;
  margin: 0 0 0.5rem 0;
  transition: color 0.3s ease;
}

.journal-card:hover .article-title {
  color: var(--color-primary);
}

.article-authors {
  font-size: 0.825rem;
  color: var(--color-text-secondary);
  font-style: italic;
  margin-bottom: 0.875rem;
}

.article-abstract {
  font-size: 0.875rem;
  line-height: 1.65;
  color: var(--color-text-secondary);
  flex-grow: 1;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 1rem;
}

.keyword-tag {
  font-size: 0.72rem;
  font-weight: 500;
  padding: 0.2rem 0.625rem;
  border-radius: var(--radius-full);
  color: var(--color-primary-dark);
  background: rgba(255, 107, 157, 0.1);
  border: 1px solid rgba(255, 107, 157, 0.15);
}

.article-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding-top: 0.875rem;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.article-doi {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.read-more {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-primary);
  white-space: nowrap;
  transition: gap 0.3s ease;
}

.journal-card:hover .read-more {
  gap: 0.5rem;
}
</style>

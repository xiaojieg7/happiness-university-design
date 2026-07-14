import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DiaryView from '../views/DiaryView.vue'
import DiaryNewView from '../views/DiaryNewView.vue'
import DiaryDetailView from '../views/DiaryDetailView.vue'
import SettingsView from '../views/SettingsView.vue'
import JournalView from '../views/JournalView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/diary',
      name: 'diary',
      component: DiaryView,
    },
    {
      path: '/diary/new',
      name: 'diary-new',
      component: DiaryNewView,
    },
    {
      path: '/diary/:id',
      name: 'diary-detail',
      component: DiaryDetailView,
    },
    {
      path: '/journal',
      name: 'journal',
      component: JournalView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
    },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

export default router

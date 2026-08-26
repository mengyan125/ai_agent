import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import ChatPage from '../views/ChatPage.vue'
import ModelSettingsPage from '../views/ModelSettingsPage.vue'
import SystemStatusPage from '../views/SystemStatusPage.vue'

/** Routes exposed by the Phase 0 application shell. */
const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/chat' },
  { path: '/chat', name: 'chat', component: ChatPage },
  { path: '/settings/models', name: 'model-settings', component: ModelSettingsPage },
  { path: '/system/status', name: 'system-status', component: SystemStatusPage },
  { path: '/:pathMatch(.*)*', redirect: '/chat' },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})

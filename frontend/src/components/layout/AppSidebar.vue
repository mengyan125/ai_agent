<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ChatDotRound, Setting, Monitor, FolderOpened } from '@element-plus/icons-vue'

interface NavItem {
  label: string
  to: string
  icon: typeof ChatDotRound
  group: 'workspace' | 'tools' | 'settings'
  disabled?: boolean
}

const route = useRoute()

/** Sidebar navigation reflects currently available Phase 0 routes. */
const navItems: NavItem[] = [
  { label: '智能对话', to: '/chat', icon: ChatDotRound, group: 'workspace' },
  { label: '知识库', to: '#', icon: FolderOpened, group: 'workspace', disabled: true },
  { label: '系统状态', to: '/system/status', icon: Monitor, group: 'tools' },
  { label: '模型配置', to: '/settings/models', icon: Setting, group: 'settings' },
]

const groups = [
  { key: 'workspace', label: 'WORKSPACE' },
  { key: 'tools', label: 'TOOLS' },
  { key: 'settings', label: 'SETTINGS' },
] as const

function isActive(item: NavItem): boolean {
  return !item.disabled && route.path === item.to
}

const visibleGroups = computed(() =>
  groups.map((group) => ({ ...group, items: navItems.filter((item) => item.group === group.key) })),
)
</script>

<template>
  <aside class="app-sidebar" aria-label="主导航">
    <div class="app-sidebar__brand">
      <span class="app-sidebar__logo" aria-hidden="true" />
      <span>Agent Studio</span>
    </div>

    <nav class="app-sidebar__nav">
      <section v-for="group in visibleGroups" :key="group.key" class="app-sidebar__group">
        <h2 class="app-sidebar__group-title">{{ group.label }}</h2>
        <RouterLink
          v-for="item in group.items"
          :key="item.label"
          :to="item.disabled ? route.fullPath : item.to"
          class="app-sidebar__item"
          :class="{ 'app-sidebar__item--active': isActive(item), 'app-sidebar__item--disabled': item.disabled }"
          :aria-disabled="item.disabled"
          @click="item.disabled && $event.preventDefault()"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </RouterLink>
      </section>
    </nav>
  </aside>
</template>

<style scoped lang="scss">
.app-sidebar {
  display: flex;
  width: 344px;
  min-height: 100vh;
  flex-direction: column;
  background: #111827;
  color: #f8fafc;
  padding: 44px 22px;

  &__brand {
    display: flex;
    align-items: center;
    gap: 14px;
    font-size: 27px;
    font-weight: 700;
    letter-spacing: -0.02em;
    padding: 0 11px;
  }

  &__logo {
    width: 39px;
    height: 39px;
    border-radius: 11px;
    background: #6366f1;
  }

  &__nav {
    display: flex;
    min-height: 0;
    flex: 1;
    flex-direction: column;
    margin-top: 48px;
  }

  &__group {
    display: grid;
    gap: 8px;

    &:not(:first-child) {
      margin-top: auto;
    }
  }

  &__group-title {
    margin: 0 0 1px;
    color: #a6b3c9;
    font-size: 16px;
    font-weight: 600;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 58px;
    border-radius: 12px;
    color: #d4dbea;
    font-size: 18px;
    font-weight: 600;
    padding: 0 17px;
    text-decoration: none;
    transition: background-color 0.2s ease, color 0.2s ease;

    &:hover:not(&--disabled) {
      background: #1f2937;
      color: #fff;
    }

    &--active {
      background: #4338ca;
      color: #fff;
    }

    &--disabled {
      color: #aab5c8;
      cursor: not-allowed;
    }
  }
}
</style>

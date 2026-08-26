<script setup lang="ts">
import { computed, onMounted } from 'vue'

import HealthStatusCard from '../components/system/HealthStatusCard.vue'
import { useSystemStore } from '../stores/system'

const system = useSystemStore()
const apiStatus = computed(() => system.loading ? 'loading' : system.health?.services.api.status === 'healthy' ? 'healthy' : 'unhealthy')
const sqliteStatus = computed(() => system.loading ? 'loading' : system.health?.services.sqlite.status === 'healthy' ? 'healthy' : 'unhealthy')
const apiDetail = computed(() => system.health ? `FastAPI · v${system.health.version}` : '服务暂时不可用，请重试。')
const sqliteDetail = computed(() => system.health?.services.sqlite.detail || (system.health ? 'SQLite · 数据库已初始化' : '服务暂时不可用，请重试。'))

onMounted(() => system.refreshHealth())
</script>

<template>
  <section class="system-status-page">
    <header class="system-status-page__header">
      <div>
        <h1>系统状态</h1>
        <p>查看本地服务、数据存储与基础依赖的健康状态。</p>
      </div>
      <el-button class="system-status-page__refresh" type="primary" size="large" :loading="system.loading" :disabled="system.loading" @click="system.refreshHealth()">
        刷新状态
      </el-button>
    </header>

    <div class="system-status-page__cards">
      <HealthStatusCard title="API 服务" :status="apiStatus" :detail="apiDetail" />
      <HealthStatusCard title="SQLite" :status="sqliteStatus" :detail="sqliteDetail" />
      <HealthStatusCard title="Web 应用" status="healthy" detail="Vue 3 · 本地开发服务" />
    </div>

    <section class="system-status-page__dependencies">
      <div class="system-status-page__dependency-header">
        <h2>依赖检查</h2>
        <el-button v-if="system.lastError" link type="primary" @click="system.refreshHealth()">重试</el-button>
      </div>
      <p v-if="system.lastError" class="system-status-page__error" role="alert">{{ system.lastError }}</p>
      <div class="system-status-page__table">
        <span>组件</span><span>状态</span><span>说明</span>
        <span>OpenAPI</span><span class="is-ready">可用</span><span>开发文档服务已启用</span>
        <span>日志系统</span><span class="is-ready">可用</span><span>请求日志按安全策略记录</span>
        <span>模型服务</span><span>未配置</span><span>将在后续阶段接入</span>
      </div>
    </section>
  </section>
</template>

<style scoped lang="scss">
.system-status-page {
  &__header { display: flex; align-items: flex-start; justify-content: space-between; h1 { margin: 0; color: #111827; font-size: 38px; line-height: 1.25; } p { margin: 8px 0 0; color: #64748b; font-size: 19px; } }
  &__refresh { color: #4f46e5; background: #fff; border-color: #fff; }
  &__cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 28px; margin-top: 48px; }
  &__dependencies { margin-top: 48px; min-height: 390px; border-radius: 16px; background: #fff; padding: 42px 40px; }
  &__dependency-header { display: flex; align-items: center; justify-content: space-between; h2 { margin: 0; color: #111827; font-size: 28px; } }
  &__error { margin: 18px 0 0; color: #b91c1c; }
  &__table { display: grid; grid-template-columns: 1fr 1fr 3fr; column-gap: 48px; row-gap: 26px; margin-top: 68px; color: #475569; font-size: 19px; }
  .is-ready { color: #047857; font-weight: 700; }
}
</style>

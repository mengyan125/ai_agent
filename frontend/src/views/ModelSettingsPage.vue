<script setup lang="ts">
import DefaultChatModelCard from '../components/models/DefaultChatModelCard.vue'
import ModelConfigForm from '../components/models/ModelConfigForm.vue'
import ModelConfigList from '../components/models/ModelConfigList.vue'
</script>

<template>
  <section class="model-settings-page">
    <header class="model-settings-page__header">
      <div><h1>模型配置</h1><p>管理云模型连接与默认模型。API Key 仅以脱敏形式展示。</p></div>
      <el-button type="primary" size="large">添加模型</el-button>
    </header>
    <DefaultChatModelCard />
    <div class="model-settings-page__configuration">
      <ModelConfigList />
      <ModelConfigForm />
    </div>
  </section>
</template>

<style scoped lang="scss">
.model-settings-page { &__header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 48px; h1 { margin: 0; color: #111827; font-size: 38px; line-height: 1.25; } p { margin: 8px 0 0; color: #64748b; font-size: 19px; } } &__configuration { display: grid; grid-template-columns: minmax(280px, 1fr) minmax(520px, 2fr); gap: 40px; margin-top: 48px; } }
</style>

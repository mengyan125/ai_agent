<template>
  <section class="model-config-form">
    <h2>配置模型参数</h2>
    <el-form label-position="top" @submit.prevent>
      <el-form-item label="配置名称"><el-input v-model="form.name" placeholder="例如：OpenAI Compatible" /></el-form-item>
      <el-form-item label="Base URL"><el-input v-model="form.baseUrl" placeholder="https://api.example.com/v1" /></el-form-item>
      <el-form-item label="模型名称"><el-input v-model="form.model" placeholder="选择或输入模型名称" /></el-form-item>
      <el-form-item label="API Key"><el-input v-model="form.apiKey" type="password" show-password placeholder="sk-••••••••••" /></el-form-item>
      <div class="model-config-form__actions">
        <el-button link type="primary" @click="notify">测试连接</el-button>
        <el-button type="primary" @click="notify">保存配置</el-button>
      </div>
    </el-form>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useFeedbackStore } from '../../stores/feedback'

const form = reactive({ name: '', baseUrl: '', model: '', apiKey: '' })
const feedback = useFeedbackStore()
function notify() { feedback.notify({ type: 'info', title: '模型配置', message: '模型配置能力将在 Phase 1 提供。' }) }
</script>

<style scoped lang="scss">
.model-config-form { border-radius: 18px; background: #fff; padding: 40px; }
h2 { margin: 0 0 30px; color: #111827; font-size: 30px; }
.model-config-form :deep(.el-form-item__label) { color: #475569; font-size: 18px; font-weight: 700; } .model-config-form :deep(.el-input__wrapper) { min-height: 58px; border-radius: 12px; background: #f1f5f9; box-shadow: none; } .model-config-form :deep(.el-input__inner) { font-size: 18px; }
.model-config-form__actions { display: flex; align-items: center; gap: 20px; margin-top: 6px; } .model-config-form__actions .el-button { font-size: 18px; font-weight: 700; }
</style>

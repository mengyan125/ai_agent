<template>
  <section class="model-config-list">
    <h2>已配置模型</h2>
    <p class="model-config-list__count">2 个模型配置</p>
    <button class="model-config-list__item model-config-list__item--active" type="button" @click="selectModel('OpenAI Compatible')">
      <strong>OpenAI Compatible</strong><span>gpt-4.1-mini · 默认聊天</span>
    </button>
    <button class="model-config-list__item" type="button" @click="selectModel('Anthropic Compatible')">
      <strong>Anthropic Compatible</strong><span>claude-sonnet · 已配置</span>
    </button>
  </section>
</template>

<script setup lang="ts">
import { useFeedbackStore } from '../../stores/feedback'
const feedback = useFeedbackStore()
function selectModel(name: string) { feedback.notify({ type: 'info', title: '模型配置', message: `${name} 配置将在 Phase 1 提供。` }) }
</script>

<style scoped lang="scss">
.model-config-list { border-radius: 18px; background: #fff; padding: 40px 36px; }
h2 { margin: 0; color: #111827; font-size: 30px; } .model-config-list__count { margin: 28px 0; color: #64748b; font-size: 18px; }
.model-config-list__item { display: grid; width: 100%; gap: 12px; border: 0; border-radius: 14px; background: #f8fafc; color: #334155; cursor: pointer; text-align: left; padding: 24px 28px; } .model-config-list__item + .model-config-list__item { margin-top: 18px; }
.model-config-list__item--active { background: #eef2ff; color: #312e81; } .model-config-list__item strong { font-size: 19px; } .model-config-list__item span { color: #4f46e5; font-size: 17px; }
</style>

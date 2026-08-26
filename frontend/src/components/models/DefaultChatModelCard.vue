<template>
  <article class="default-chat-model-card">
    <div>
      <p class="default-chat-model-card__eyebrow">默认聊天模型</p>
      <h2>OpenAI Compatible · gpt-4.1-mini</h2>
      <p class="default-chat-model-card__detail">已启用 · API Key 已安全保存并脱敏</p>
    </div>
    <div class="default-chat-model-card__actions">
      <span class="default-chat-model-card__label">默认模型</span>
      <strong><i />已启用</strong>
      <button type="button" @click="notify">测试连接 · 编辑</button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useFeedbackStore } from '../../stores/feedback'

const feedback = useFeedbackStore()
function notify() {
  feedback.notify({ type: 'info', title: '模型配置', message: '模型配置能力将在 Phase 1 提供。' })
}
</script>

<style scoped lang="scss">
.default-chat-model-card { display: flex; align-items: center; justify-content: space-between; border-radius: 18px; background: #fff; padding: 42px 40px; }
.default-chat-model-card__eyebrow, .default-chat-model-card__label { margin: 0; color: #64748b; font-size: 18px; font-weight: 700; }
h2 { margin: 20px 0 0; color: #111827; font-size: 30px; line-height: 1.2; }
.default-chat-model-card__detail { margin: 20px 0 0; color: #475569; font-size: 18px; }
.default-chat-model-card__actions { display: grid; justify-items: end; gap: 14px; }
.default-chat-model-card__actions strong { color: #047857; font-size: 20px; } .default-chat-model-card__actions i { display: inline-block; width: 14px; height: 14px; margin-right: 8px; border-radius: 50%; background: #059669; }
.default-chat-model-card__actions button { border: 0; background: transparent; color: #4f46e5; cursor: pointer; font-size: 18px; font-weight: 700; }
</style>

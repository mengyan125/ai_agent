<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'

import ChatComposer from '../components/chat/ChatComposer.vue'
import ChatHistoryPlaceholder from '../components/chat/ChatHistoryPlaceholder.vue'
import ConversationList from '../components/chat/ConversationList.vue'
</script>

<template>
  <section class="chat-page">
    <header class="chat-page__header">
      <div>
        <h1>智能对话</h1>
        <p>与 Agent 协作，检索知识库并调用受控工具。</p>
      </div>
      <span class="chat-page__status"><i />系统在线</span>
    </header>

    <div class="chat-page__body">
      <ConversationList />
      <section class="chat-page__surface" aria-label="对话区域">
        <p class="chat-page__intro">你可以让我分析文档、检索知识库，或执行经过确认的工具操作。</p>
        <ChatHistoryPlaceholder />
        <ChatComposer />
      </section>
    </div>
  </section>
</template>

<style scoped lang="scss">
.chat-page {
  display: flex;
  min-height: calc(100vh - 84px);
  flex-direction: column;

  &__header { display: flex; align-items: flex-start; justify-content: space-between; h1 { margin: 0; color: #111827; font-size: 38px; line-height: 1.25; } p { margin: 8px 0 0; color: #64748b; font-size: 19px; } }
  &__status { display: inline-flex; align-items: center; gap: 8px; border-radius: 14px; background: #ecfdf5; color: #047857; font-size: 16px; font-weight: 700; padding: 14px 18px; i { width: 12px; height: 12px; border-radius: 50%; background: #059669; } }
  &__body { display: grid; min-height: 0; flex: 1; grid-template-columns: 28% minmax(0, 1fr); gap: 40px; margin-top: 48px; }
  &__surface { display: flex; min-height: 0; flex-direction: column; border-radius: 18px; background: #fff; padding: 48px; }
  &__intro { margin: 0; color: #334155; font-size: 20px; line-height: 1.6; }
}
</style>

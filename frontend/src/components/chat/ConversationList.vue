<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { useFeedbackStore } from '../../stores/feedback'

const feedback = useFeedbackStore()
function notifyNewConversation() {
  feedback.notify({ type: 'info', title: '新建对话', message: '对话能力将在 Phase 1 提供。' })
}
</script>

<template>
  <aside class="conversation-list" aria-label="会话列表">
    <button class="conversation-list__new" type="button" @click="notifyNewConversation">
      <el-icon><Plus /></el-icon>
      <span>新建对话</span>
    </button>
    <div class="conversation-list__content">
      <p class="conversation-list__date">今天</p>
      <p class="conversation-list__knowledge">产品知识库问答</p>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.conversation-list { display: flex; min-height: 0; flex-direction: column; border-radius: 18px; background: #fff; padding: 32px; }
.conversation-list__new { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 64px; border: 0; border-radius: 14px; background: #4f46e5; color: #fff; cursor: pointer; font-size: 22px; font-weight: 700; }
.conversation-list__content { display: flex; min-height: 0; flex: 1; flex-direction: column; }
.conversation-list__date { margin: 405px 0 0; color: #475569; font-size: 20px; }
.conversation-list__knowledge { margin: auto 0 4px; color: #475569; font-size: 20px; }
</style>

<template>
  <form class="chat-composer" aria-label="消息输入" @submit.prevent="notifyUnavailable">
    <el-input
      type="textarea"
      :rows="3"
      resize="none"
      placeholder="输入问题，支持多行描述。&#10;可输入 / 调用工具，Enter 发送，Shift + Enter 换行。"
      aria-label="输入问题"
    />
    <div class="chat-composer__footer">
      <span>Enter 发送 · Shift + Enter 换行</span>
      <el-button class="chat-composer__send" type="primary" circle native-type="submit" aria-label="发送">
        <el-icon><Top /></el-icon>
      </el-button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { Top } from '@element-plus/icons-vue'
import { useFeedbackStore } from '../../stores/feedback'

const feedback = useFeedbackStore()
function notifyUnavailable() {
  feedback.notify({ type: 'info', title: '发送未启用', message: '对话能力将在 Phase 1 提供。' })
}
</script>

<style scoped lang="scss">
.chat-composer { margin-top: 34px; border-radius: 18px; background: #f1f5f9; padding: 24px 32px 18px; }
.chat-composer :deep(.el-textarea__inner) { min-height: 88px !important; border: 0; box-shadow: none; background: transparent; color: #334155; font-size: 18px; line-height: 1.6; padding: 0; }
.chat-composer :deep(.el-textarea__inner::placeholder) { color: #94a3b8; }
.chat-composer__footer { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; color: #94a3b8; font-size: 16px; }
.chat-composer__send { width: 50px; height: 50px; font-size: 22px; }
</style>

<template>
  <div class="chat-history-placeholder" aria-label="聊天历史占位区">
    <div class="chat-history-placeholder__message">
      你好，我是 Agent Studio。你想从哪个知识库开始？
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat-history-placeholder { display: flex; min-height: 360px; flex: 1; flex-direction: column; margin-top: 34px; border-radius: 18px; background: #eef2ff; padding: 38px 32px; }
.chat-history-placeholder__message { color: #312e81; font-size: 20px; line-height: 1.6; }
</style>

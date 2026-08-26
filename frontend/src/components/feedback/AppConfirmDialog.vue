<script setup lang="ts">
import { computed } from 'vue'

import { useFeedbackStore } from '../../stores/feedback'

const feedback = useFeedbackStore()
const request = computed(() => feedback.confirmRequest)

function confirm() {
  feedback.resolveConfirm(true)
}

function cancel() {
  feedback.resolveConfirm(false)
}
</script>

<template>
  <el-dialog
    :model-value="Boolean(request)"
    :title="request?.title"
    width="420px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="cancel"
  >
    <p class="app-confirm-dialog__message">{{ request?.message }}</p>

    <template #footer>
      <el-button @click="cancel">{{ request?.cancelText ?? '取消' }}</el-button>
      <el-button :type="request?.type === 'danger' ? 'danger' : 'primary'" @click="confirm">
        {{ request?.confirmText ?? '确认' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.app-confirm-dialog__message {
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
}
</style>

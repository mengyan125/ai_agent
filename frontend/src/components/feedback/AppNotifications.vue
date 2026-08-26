<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElNotification } from 'element-plus'

import { useFeedbackStore, type NotificationItem } from '../../stores/feedback'

const feedback = useFeedbackStore()
const displayedNotificationId = ref<string | null>(null)

function showNotification(item: NotificationItem) {
  displayedNotificationId.value = item.id
  ElNotification({
    title: item.title,
    message: item.message,
    type: item.type,
    onClose: () => {
      displayedNotificationId.value = null
      feedback.dismiss(item.id)
    },
  })
}

watch(
  () => feedback.notifications,
  (notifications) => {
    if (!displayedNotificationId.value && notifications[0]) {
      showNotification(notifications[0])
    }
  },
  { deep: true },
)
</script>

<template>
  <span class="app-notifications" aria-hidden="true" />
</template>

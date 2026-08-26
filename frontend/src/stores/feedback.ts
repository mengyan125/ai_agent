import { defineStore } from 'pinia'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface NotificationItem {
  id: string
  type: NotificationType
  title?: string
  message: string
}

export interface ConfirmOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'warning' | 'danger' | 'info'
}

interface QueuedConfirmRequest {
  options: ConfirmOptions
  resolve: (confirmed: boolean) => void
}

interface FeedbackState {
  notifications: NotificationItem[]
  confirmRequest: ConfirmOptions | null
  confirmQueue: QueuedConfirmRequest[]
}

let notificationSequence = 0

export const useFeedbackStore = defineStore('feedback', {
  state: (): FeedbackState => ({
    notifications: [],
    confirmRequest: null,
    confirmQueue: [],
  }),

  actions: {
    notify(input: Omit<NotificationItem, 'id'>) {
      notificationSequence += 1
      this.notifications.push({
        ...input,
        id: `notification-${notificationSequence}`,
      })
    },

    dismiss(id: string) {
      this.notifications = this.notifications.filter((notification) => notification.id !== id)
    },

    confirm(options: ConfirmOptions): Promise<boolean> {
      return new Promise((resolve) => {
        const request = { options, resolve }

        if (this.confirmRequest) {
          this.confirmQueue.push(request)
          return
        }

        this.confirmRequest = options
        this.confirmQueue.push(request)
      })
    },

    resolveConfirm(confirmed: boolean) {
      const currentRequest = this.confirmQueue.shift()
      currentRequest?.resolve(confirmed)
      this.confirmRequest = this.confirmQueue[0]?.options ?? null
    },
  },
})

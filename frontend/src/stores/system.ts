import { defineStore } from 'pinia'

import { ApiClientError, toSafeErrorMessage } from '../api/http'
import { getHealth, type HealthPayload } from '../api/health'
import { useFeedbackStore } from './feedback'

interface SystemState {
  health: HealthPayload | null
  loading: boolean
  lastError: string | null
}

export const useSystemStore = defineStore('system', {
  state: (): SystemState => ({
    health: null,
    loading: false,
    lastError: null,
  }),

  actions: {
    async refreshHealth(): Promise<void> {
      if (this.loading) return

      this.loading = true
      this.lastError = null

      try {
        this.health = await getHealth()
      } catch (error: unknown) {
        this.health = null
        this.lastError = toSafeErrorMessage(error)
        if (!(error instanceof ApiClientError)) {
          useFeedbackStore().notify({
            type: 'error',
            title: '状态检查失败',
            message: this.lastError,
          })
        }
      } finally {
        this.loading = false
      }
    },
  },
})

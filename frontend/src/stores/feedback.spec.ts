import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useFeedbackStore } from './feedback'

describe('TC-006: feedback store notifications and confirmation promises', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('adds a notification and dismisses it by id', () => {
    const feedback = useFeedbackStore()

    feedback.notify({
      type: 'success',
      title: '已完成',
      message: '操作已完成。',
    })

    expect(feedback.notifications).toHaveLength(1)
    expect(feedback.notifications[0]).toMatchObject({
      type: 'success',
      title: '已完成',
      message: '操作已完成。',
    })

    feedback.dismiss(feedback.notifications[0].id)

    expect(feedback.notifications).toHaveLength(0)
  })

  it('queues confirmations and resolves them in display order', async () => {
    const feedback = useFeedbackStore()
    const firstConfirmation = feedback.confirm({ title: '确认第一项', message: '继续执行第一项？' })
    const secondConfirmation = feedback.confirm({ title: '确认第二项', message: '继续执行第二项？' })

    expect(feedback.confirmRequest?.title).toBe('确认第一项')

    feedback.resolveConfirm(true)
    await expect(firstConfirmation).resolves.toBe(true)
    expect(feedback.confirmRequest?.title).toBe('确认第二项')

    feedback.resolveConfirm(false)
    await expect(secondConfirmation).resolves.toBe(false)
    expect(feedback.confirmRequest).toBeNull()
  })
})

import { createApp, nextTick } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import { afterEach, describe, expect, it } from 'vitest'

import ModelSettingsPage from './ModelSettingsPage.vue'
import { useFeedbackStore } from '../stores/feedback'

let app: ReturnType<typeof createApp> | undefined
function mountPage() { const root = document.createElement('div'); document.body.appendChild(root); app = createApp(ModelSettingsPage).use(createPinia()).use(ElementPlus); app.mount(root) }
afterEach(() => { app?.unmount(); app = undefined; document.body.replaceChildren() })

describe('TC-009: model settings page structure', () => {
  it('renders default model, configured list, and parameter form without embedding module', async () => {
    mountPage()
    await nextTick()
    expect(document.querySelector('.default-chat-model-card')).not.toBeNull()
    expect(document.querySelector('.model-config-list')).not.toBeNull()
    expect(document.querySelector('.model-config-form')).not.toBeNull()
    expect(document.body.textContent).toContain('默认聊天模型')
    expect(document.body.textContent).not.toContain('默认嵌入模型')
    expect(document.body.textContent).not.toContain('Embedding Provider')
    expect(document.querySelectorAll('input')).toHaveLength(4)
  })

  it('keeps test and save actions local and shows an info notification', async () => {
    mountPage()
    await nextTick()
    const buttons = [...document.querySelectorAll<HTMLButtonElement>('.model-config-form button')]
    buttons.forEach((button) => button.click())
    await nextTick()
    expect(useFeedbackStore().notifications).toHaveLength(2)
    expect(useFeedbackStore().notifications[0]?.type).toBe('info')
    expect(useFeedbackStore().notifications[0]?.message).toContain('模型配置能力将在 Phase 1 提供')
  })
})

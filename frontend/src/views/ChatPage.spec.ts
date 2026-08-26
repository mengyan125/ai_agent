import { createApp, nextTick } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import { afterEach, describe, expect, it, vi } from 'vitest'

import ChatPage from './ChatPage.vue'

let app: ReturnType<typeof createApp> | undefined
function mountPage() { const root = document.createElement('div'); document.body.appendChild(root); app = createApp(ChatPage).use(createPinia()).use(ElementPlus); app.mount(root) }
afterEach(() => { app?.unmount(); app = undefined; document.body.replaceChildren() })

describe('TC-009: chat page structure', () => {
  it('renders conversation list, history above composer, and multiline input', async () => {
    mountPage()
    await nextTick()
    expect(document.querySelector('.conversation-list')).not.toBeNull()
    expect(document.querySelector('.chat-history-placeholder')).not.toBeNull()
    expect(document.querySelector('textarea')).not.toBeNull()
    expect(document.querySelector('.chat-composer')).not.toBeNull()
    const history = document.querySelector('.chat-history-placeholder')
    const composer = document.querySelector('.chat-composer')
    expect(history).not.toBeNull()
    expect(composer).not.toBeNull()
    expect(history && composer && history.compareDocumentPosition(composer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('does not send a request when submitting the placeholder composer', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    mountPage()
    await nextTick()
    document.querySelector<HTMLFormElement>('.chat-composer')?.requestSubmit()
    expect(fetchSpy).not.toHaveBeenCalled()
    fetchSpy.mockRestore()
  })
})

import { createApp, nextTick } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import { afterEach, describe, expect, it } from 'vitest'

import App from '../App.vue'
import router from './index'

const validRoutes = [
  { path: '/chat', title: '智能对话' },
  { path: '/settings/models', title: '模型配置' },
  { path: '/system/status', title: '系统状态' },
] as const

let app: ReturnType<typeof createApp> | undefined

function mountApplication() {
  const root = document.createElement('div')
  document.body.appendChild(root)
  app = createApp(App).use(createPinia()).use(router).use(ElementPlus)
  app.mount(root)
}

afterEach(() => {
  app?.unmount()
  app = undefined
  document.body.replaceChildren()
})

describe('TC-005: Phase 0 routes', () => {
  it('redirects the root route to the chat page', async () => {
    await router.push('/')
    await router.isReady()

    expect(router.currentRoute.value.path).toBe('/chat')
    expect(router.currentRoute.value.name).toBe('chat')
  })

  it('registers all available application routes', () => {
    const paths = router.getRoutes().map((route) => route.path)

    expect(paths).toEqual(expect.arrayContaining(['/chat', '/settings/models', '/system/status']))
  })

  it('redirects unknown routes to the chat page', async () => {
    await router.push('/not-found')
    await router.isReady()

    expect(router.currentRoute.value.path).toBe('/chat')
  })

  it.each(validRoutes)('renders the application shell, title, and active navigation for $path', async ({ path, title }) => {
    await router.push(path)
    await router.isReady()
    mountApplication()
    await nextTick()

    const shell = document.querySelector('.app-shell')
    const sidebar = document.querySelector('.app-sidebar')
    const pageTitle = document.querySelector('main h1')
    const activeItems = document.querySelectorAll('.app-sidebar__item--active')
    const currentActiveItem = document.querySelector(`.app-sidebar__item--active[href="${path}"]`)

    expect(shell).not.toBeNull()
    expect(sidebar).not.toBeNull()
    expect(router.currentRoute.value.path).toBe(path)
    expect(pageTitle?.textContent).toBe(title)
    expect(activeItems).toHaveLength(1)
    expect(currentActiveItem).not.toBeNull()
  })
})

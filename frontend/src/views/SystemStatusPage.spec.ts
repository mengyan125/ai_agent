import { createApp, nextTick } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import SystemStatusPage from './SystemStatusPage.vue'
import { getHealth } from '../api/health'

vi.mock('../api/health', () => ({
  getHealth: vi.fn(),
}))

const mockedGetHealth = vi.mocked(getHealth)
let app: ReturnType<typeof createApp> | undefined

function mountPage() {
  const root = document.createElement('div')
  document.body.appendChild(root)
  app = createApp(SystemStatusPage).use(createPinia()).use(ElementPlus)
  app.mount(root)
}

const healthyPayload = {
  status: 'healthy' as const,
  version: '0.1.0',
  checkedAt: '2026-08-26T00:00:00Z',
  services: { api: { status: 'healthy' as const }, sqlite: { status: 'healthy' as const, detail: '数据库已初始化' } },
}

afterEach(() => {
  app?.unmount()
  app = undefined
  document.body.replaceChildren()
  vi.clearAllMocks()
  mockedGetHealth.mockReset()
})

describe('TC-007: system status success and refresh', () => {
  beforeEach(() => mockedGetHealth.mockResolvedValue(healthyPayload))

  it('shows loading then healthy cards and refreshes once per click', async () => {
    let resolveHealth: ((value: typeof healthyPayload) => void) | undefined
    mockedGetHealth.mockImplementationOnce(() => new Promise((resolve) => { resolveHealth = resolve }))

    mountPage()
    await nextTick()
    expect(document.querySelector('.health-card__status--loading')).not.toBeNull()
    expect(mockedGetHealth).toHaveBeenCalledTimes(1)

    resolveHealth?.(healthyPayload)
    await nextTick()
    await nextTick()
    expect(document.querySelectorAll('.health-card__status--healthy')).toHaveLength(3)
    expect(document.body.textContent).toContain('Web 应用')

    document.querySelector<HTMLButtonElement>('.system-status-page__refresh')?.click()
    await nextTick()
    await nextTick()
    expect(mockedGetHealth).toHaveBeenCalledTimes(2)
  })
})

describe('TC-008: system status failure and retry', () => {
  it('shows unavailable cards and recovers after retry', async () => {
    mockedGetHealth.mockRejectedValueOnce(new Error('network unavailable')).mockResolvedValueOnce(healthyPayload)

    mountPage()
    await nextTick()
    await nextTick()
    expect(document.querySelectorAll('.health-card__status--unhealthy')).toHaveLength(2)
    expect(document.body.textContent).toContain('请求发生异常，请稍后重试。')
    expect(document.querySelector('.system-status-page__error')).not.toBeNull()

    document.querySelector<HTMLButtonElement>('.system-status-page__dependency-header button')?.click()
    await nextTick()
    await nextTick()
    expect(document.querySelectorAll('.health-card__status--healthy')).toHaveLength(3)
    expect(mockedGetHealth).toHaveBeenCalledTimes(3)
  })
})

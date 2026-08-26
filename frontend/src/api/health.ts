import { get } from './http'

export interface ServiceHealth {
  status: 'healthy'
  detail?: string
}

export interface HealthPayload {
  status: 'healthy'
  version: string
  checkedAt: string
  services: {
    api: ServiceHealth
    sqlite: ServiceHealth
  }
}

export function getHealth(): Promise<HealthPayload> {
  return get<HealthPayload>('/api/health')
}

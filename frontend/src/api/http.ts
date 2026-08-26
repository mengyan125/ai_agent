import axios, { AxiosError, type AxiosInstance } from 'axios'

import { useFeedbackStore } from '../stores/feedback'
import type { ApiEnvelope } from './types'

const DEFAULT_API_BASE_URL = 'http://localhost:8000'

export class ApiClientError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiClientError'
  }
}

function notifyRequestError(message: string) {
  useFeedbackStore().notify({
    type: 'error',
    title: '请求失败',
    message,
  })
}

export function toSafeErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.message
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError

    if (axiosError.code === 'ECONNABORTED') {
      return '请求超时，请稍后重试。'
    }

    if (!axiosError.response) {
      return '无法连接到服务，请确认服务已启动后重试。'
    }

    return '服务暂时无法完成请求，请稍后重试。'
  }

  return '请求发生异常，请稍后重试。'
}

export const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
  timeout: 10_000,
})

http.interceptors.response.use(
  (response) => {
    const envelope = response.data as ApiEnvelope<unknown>

    if (!envelope || typeof envelope.code !== 'number') {
      const error = new ApiClientError('服务返回异常，请稍后重试。')
      notifyRequestError(error.message)
      return Promise.reject(error)
    }

    if (envelope.code !== 0) {
      const error = new ApiClientError('服务暂时无法完成请求，请稍后重试。')
      notifyRequestError(error.message)
      return Promise.reject(error)
    }

    return response
  },
  (error: unknown) => {
    const safeMessage = toSafeErrorMessage(error)
    notifyRequestError(safeMessage)
    return Promise.reject(new ApiClientError(safeMessage))
  },
)

/** Sends an envelope-based request and returns only its successful payload. */
export async function get<T>(url: string): Promise<T> {
  const response = await http.get<ApiEnvelope<T>>(url)
  return response.data.data
}

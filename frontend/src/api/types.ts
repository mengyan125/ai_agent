export interface ApiEnvelope<T> {
  code: number
  message: string
  data: T
  requestId: string
}

export interface ApiErrorData {
  errorCode: 'VALIDATION_ERROR' | 'NOT_FOUND' | 'SERVICE_UNAVAILABLE' | 'INTERNAL_ERROR'
}

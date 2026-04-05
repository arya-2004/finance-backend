export interface JwtPayload {
  userId: number
  email: string
  role: 'VIEWER' | 'ANALYST' | 'ADMIN'
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
}
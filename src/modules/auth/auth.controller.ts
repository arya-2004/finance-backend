import { Request, Response } from 'express'
import { registerSchema, loginSchema } from '../../validators/auth.validator'
import { registerUser, loginUser } from './auth.service'
import { sendSuccess, sendError } from '../../utils/response'

export const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body)
    if (!parsed.success) {
      return sendError(res, parsed.error.issues[0].message, 400)
    }

    const { name, email, password, role } = parsed.data
    const user = await registerUser(name, email, password, role)
    return sendSuccess(res, user, 'User registered successfully', 201)

  } catch (error: any) {
    return sendError(res, error.message, 400)
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body)
    if (!parsed.success) {
      return sendError(res, parsed.error.issues[0].message, 400)
    }

    const { email, password } = parsed.data
    const result = await loginUser(email, password)
    return sendSuccess(res, result, 'Login successful')

  } catch (error: any) {
    return sendError(res, error.message, 401)
  }
}
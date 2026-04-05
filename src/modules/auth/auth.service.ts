import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../config/database'
import { JwtPayload } from '../../types'

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role?: 'VIEWER' | 'ANALYST' | 'ADMIN'
) => {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw new Error('Email already registered')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || 'VIEWER'
    }
  })

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }
}

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new Error('Invalid email or password')
  }

  if (!user.isActive) {
    throw new Error('Account is deactivated')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('Invalid email or password')
  }

  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role
  }

  const secret = process.env.JWT_SECRET as string
  const expiresIn = (process.env.JWT_EXPIRES_IN as string) || '24h'
  const token = jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions)

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  }
}
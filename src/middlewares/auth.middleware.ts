import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { JwtPayload } from '../types'

// Extend Express Request type to include our user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' })
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
    
    // Attach user to request so routes can access it
    req.user = decoded
    
    next() // move to the next function
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' })
  }
}

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to perform this action' })
    }

    next()
  }
}
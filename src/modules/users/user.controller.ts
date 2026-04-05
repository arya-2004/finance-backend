import { Request, Response } from 'express'
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  deleteUser
} from './user.service'
import { sendSuccess, sendError } from '../../utils/response'

export const getAll = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query as { page?: string; limit?: string }
    const result = await getAllUsers(page, limit)
    return sendSuccess(res, result, 'Users fetched successfully')
  } catch (error: any) {
    return sendError(res, error.message)
  }
}

export const getOne = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string)
    if (isNaN(id)) return sendError(res, 'Invalid user ID', 400)
    const user = await getUserById(id)
    return sendSuccess(res, user, 'User fetched successfully')
  } catch (error: any) {
    return sendError(res, error.message, 404)
  }
}

export const updateRole = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string)
    if (isNaN(id)) return sendError(res, 'Invalid user ID', 400)
    const { role } = req.body
    if (!['VIEWER', 'ANALYST', 'ADMIN'].includes(role)) {
      return sendError(res, 'Invalid role', 400)
    }
    const user = await updateUserRole(id, role)
    return sendSuccess(res, user, 'User role updated successfully')
  } catch (error: any) {
    return sendError(res, error.message, 400)
  }
}

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string)
    if (isNaN(id)) return sendError(res, 'Invalid user ID', 400)
    const { isActive } = req.body
    if (typeof isActive !== 'boolean') {
      return sendError(res, 'isActive must be a boolean', 400)
    }
    const user = await updateUserStatus(id, isActive)
    return sendSuccess(res, user, 'User status updated successfully')
  } catch (error: any) {
    return sendError(res, error.message, 400)
  }
}

export const remove = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string)
    if (isNaN(id)) return sendError(res, 'Invalid user ID', 400)
    await deleteUser(id)
    return sendSuccess(res, null, 'User deleted successfully')
  } catch (error: any) {
    return sendError(res, error.message, 400)
  }
}
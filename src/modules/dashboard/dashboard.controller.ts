import { Request, Response } from 'express'
import {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getRecentActivity,
  getWeeklySummary
} from './dashboard.service'
import { sendSuccess, sendError } from '../../utils/response'

export const summary = async (req: Request, res: Response) => {
  try {
    const data = await getSummary()
    return sendSuccess(res, data, 'Summary fetched successfully')
  } catch (error: any) {
    return sendError(res, error.message)
  }
}

export const categoryBreakdown = async (req: Request, res: Response) => {
  try {
    const data = await getCategoryBreakdown()
    return sendSuccess(res, data, 'Category breakdown fetched successfully')
  } catch (error: any) {
    return sendError(res, error.message)
  }
}

export const monthlyTrends = async (req: Request, res: Response) => {
  try {
    const data = await getMonthlyTrends()
    return sendSuccess(res, data, 'Monthly trends fetched successfully')
  } catch (error: any) {
    return sendError(res, error.message)
  }
}

export const recentActivity = async (req: Request, res: Response) => {
  try {
    const data = await getRecentActivity()
    return sendSuccess(res, data, 'Recent activity fetched successfully')
  } catch (error: any) {
    return sendError(res, error.message)
  }
}

export const weeklySummary = async (req: Request, res: Response) => {
  try {
    const data = await getWeeklySummary()
    return sendSuccess(res, data, 'Weekly summary fetched successfully')
  } catch (error: any) {
    return sendError(res, error.message)
  }
}
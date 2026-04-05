import { Request, Response } from 'express'
import {
  createTransactionSchema,
  updateTransactionSchema,
  filterTransactionSchema
} from '../../validators/transaction.validator'
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} from './transaction.service'
import { sendSuccess, sendError } from '../../utils/response'

export const create = async (req: Request, res: Response) => {
  try {
    const parsed = createTransactionSchema.safeParse(req.body)
    if (!parsed.success) return sendError(res, parsed.error.issues[0].message, 400)

    const { amount, type, category, date, notes } = parsed.data
    const transaction = await createTransaction(amount, type, category, date, notes, req.user!.userId)
    return sendSuccess(res, transaction, 'Transaction created successfully', 201)
  } catch (error: any) {
    return sendError(res, error.message, 400)
  }
}

export const getAll = async (req: Request, res: Response) => {
  try {
    const parsed = filterTransactionSchema.safeParse(req.query)
    if (!parsed.success) return sendError(res, parsed.error.issues[0].message, 400)

    const result = await getTransactions(parsed.data)
    return sendSuccess(res, result, 'Transactions fetched successfully')
  } catch (error: any) {
    return sendError(res, error.message, 400)
  }
}

export const getOne = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string)
    if (isNaN(id)) return sendError(res, 'Invalid transaction ID', 400)

    const transaction = await getTransactionById(id)
    return sendSuccess(res, transaction, 'Transaction fetched successfully')
  } catch (error: any) {
    return sendError(res, error.message, 404)
  }
}

export const update = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string)
    if (isNaN(id)) return sendError(res, 'Invalid transaction ID', 400)

    const parsed = updateTransactionSchema.safeParse(req.body)
    if (!parsed.success) return sendError(res, parsed.error.issues[0].message, 400)

    const transaction = await updateTransaction(id, parsed.data)
    return sendSuccess(res, transaction, 'Transaction updated successfully')
  } catch (error: any) {
    return sendError(res, error.message, 400)
  }
}

export const remove = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string)
    if (isNaN(id)) return sendError(res, 'Invalid transaction ID', 400)

    await deleteTransaction(id)
    return sendSuccess(res, null, 'Transaction deleted successfully')
  } catch (error: any) {
    return sendError(res, error.message, 400)
  }
}
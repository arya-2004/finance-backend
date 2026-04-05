import { z } from 'zod'

export const createTransactionSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0'),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1, 'Category is required'),
  date: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date format'),
  notes: z.string().optional()
})

export const updateTransactionSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0').optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  category: z.string().min(1, 'Category is required').optional(),
  date: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date format').optional(),
  notes: z.string().optional()
})

export const filterTransactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  category: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  search: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  sortBy: z.enum(['date', 'amount', 'createdAt']).optional(),
  order: z.enum(['asc', 'desc']).optional()
})
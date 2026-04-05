import prisma from '../../config/database'

export const createTransaction = async (
  amount: number,
  type: 'INCOME' | 'EXPENSE',
  category: string,
  date: string,
  notes: string | undefined,
  userId: number
) => {
  return await prisma.transaction.create({
    data: {
      amount,
      type,
      category,
      date: new Date(date),
      notes,
      createdBy: userId
    }
  })
}

export const getTransactions = async (filters: {
  type?: 'INCOME' | 'EXPENSE'
  category?: string
  startDate?: string
  endDate?: string
  search?: string
  page?: string
  limit?: string
  sortBy?: string
  order?: string
}) => {
  const page = parseInt(filters.page || '1')
  const limit = parseInt(filters.limit || '10')
  const skip = (page - 1) * limit
  const orderBy = filters.sortBy || 'createdAt'
  const order = filters.order || 'desc'

  // Build dynamic where clause
  const where: any = { isDeleted: false }

  if (filters.type) where.type = filters.type
  if (filters.category) where.category = { contains: filters.category }
  if (filters.search) where.notes = { contains: filters.search }
  if (filters.startDate || filters.endDate) {
    where.date = {}
    if (filters.startDate) where.date.gte = new Date(filters.startDate)
    if (filters.endDate) where.date.lte = new Date(filters.endDate)
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [orderBy]: order },
      include: { user: { select: { name: true, email: true } } }
    }),
    prisma.transaction.count({ where })
  ])

  return {
    transactions,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}

export const getTransactionById = async (id: number) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id, isDeleted: false },
    include: { user: { select: { name: true, email: true } } }
  })
  if (!transaction) throw new Error('Transaction not found')
  return transaction
}

export const updateTransaction = async (id: number, data: {
  amount?: number
  type?: 'INCOME' | 'EXPENSE'
  category?: string
  date?: string
  notes?: string
}) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id, isDeleted: false }
  })
  if (!transaction) throw new Error('Transaction not found')

  return await prisma.transaction.update({
    where: { id },
    data: {
      ...data,
      date: data.date ? new Date(data.date) : undefined
    }
  })
}

export const deleteTransaction = async (id: number) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id, isDeleted: false }
  })
  if (!transaction) throw new Error('Transaction not found')

  // Soft delete — just mark as deleted, never actually remove
  return await prisma.transaction.update({
    where: { id },
    data: { isDeleted: true }
  })
}
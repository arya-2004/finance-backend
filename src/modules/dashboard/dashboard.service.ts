import prisma from '../../config/database'

interface Transaction {
  type: string
  amount: number
  category: string
  date: Date
}

export const getSummary = async () => {
  const transactions = await prisma.transaction.findMany({
    where: { isDeleted: false }
  })

  const totalIncome = transactions
    .filter((t: Transaction) => t.type === 'INCOME')
    .reduce((sum: number, t: Transaction) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter((t: Transaction) => t.type === 'EXPENSE')
    .reduce((sum: number, t: Transaction) => sum + t.amount, 0)

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    totalTransactions: transactions.length
  }
}

export const getCategoryBreakdown = async () => {
  const transactions = await prisma.transaction.findMany({
    where: { isDeleted: false }
  })

  const breakdown: Record<string, { income: number; expense: number }> = {}

  transactions.forEach((t: Transaction) => {
    if (!breakdown[t.category]) {
      breakdown[t.category] = { income: 0, expense: 0 }
    }
    if (t.type === 'INCOME') {
      breakdown[t.category].income += t.amount
    } else {
      breakdown[t.category].expense += t.amount
    }
  })

  return breakdown
}

export const getMonthlyTrends = async () => {
  const transactions = await prisma.transaction.findMany({
    where: { isDeleted: false },
    orderBy: { date: 'asc' }
  })

  const trends: Record<string, { income: number; expense: number }> = {}

  transactions.forEach((t: Transaction) => {
    const month = t.date.toISOString().slice(0, 7)
    if (!trends[month]) {
      trends[month] = { income: 0, expense: 0 }
    }
    if (t.type === 'INCOME') {
      trends[month].income += t.amount
    } else {
      trends[month].expense += t.amount
    }
  })

  return trends
}

export const getRecentActivity = async () => {
  return await prisma.transaction.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { user: { select: { name: true } } }
  })
}

export const getWeeklySummary = async () => {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const transactions = await prisma.transaction.findMany({
    where: {
      isDeleted: false,
      date: { gte: sevenDaysAgo }
    }
  })

  const income = transactions
    .filter((t: Transaction) => t.type === 'INCOME')
    .reduce((sum: number, t: Transaction) => sum + t.amount, 0)

  const expense = transactions
    .filter((t: Transaction) => t.type === 'EXPENSE')
    .reduce((sum: number, t: Transaction) => sum + t.amount, 0)

  return {
    income,
    expense,
    net: income - expense,
    transactionCount: transactions.length
  }
}

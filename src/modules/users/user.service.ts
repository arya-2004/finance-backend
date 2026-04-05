import prisma from '../../config/database'

export const getAllUsers = async (page?: string, limit?: string) => {
  const pageNum = parseInt(page || '1')
  const limitNum = parseInt(limit || '10')
  const skip = (pageNum - 1) * limitNum

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limitNum,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    }),
    prisma.user.count()
  ])

  return {
    users,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  }
}

export const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true
    }
  })
  if (!user) throw new Error('User not found')
  return user
}

export const updateUserRole = async (id: number, role: 'VIEWER' | 'ANALYST' | 'ADMIN') => {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw new Error('User not found')

  return await prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true
    }
  })
}

export const updateUserStatus = async (id: number, isActive: boolean) => {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw new Error('User not found')

  return await prisma.user.update({
    where: { id },
    data: { isActive },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true
    }
  })
}

export const deleteUser = async (id: number) => {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw new Error('User not found')

  await prisma.user.delete({ where: { id } })
}
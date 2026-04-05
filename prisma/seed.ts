import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({
  url: 'file:./dev.db'
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Create users
  const adminPassword = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@finance.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@finance.com',
      password: adminPassword,
      role: 'ADMIN'
    }
  })

  const analyst = await prisma.user.upsert({
    where: { email: 'analyst@finance.com' },
    update: {},
    create: {
      name: 'Analyst User',
      email: 'analyst@finance.com',
      password: adminPassword,
      role: 'ANALYST'
    }
  })

  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@finance.com' },
    update: {},
    create: {
      name: 'Viewer User',
      email: 'viewer@finance.com',
      password: adminPassword,
      role: 'VIEWER'
    }
  })

  // Create transactions
  const transactions = [
    {
      amount: 50000,
      type: 'INCOME' as const,
      category: 'Salary',
      date: new Date('2026-04-01'),
      notes: 'Monthly salary',
      createdBy: admin.id
    },
    {
      amount: 15000,
      type: 'EXPENSE' as const,
      category: 'Rent',
      date: new Date('2026-04-02'),
      notes: 'Monthly rent',
      createdBy: admin.id
    },
    {
      amount: 5000,
      type: 'EXPENSE' as const,
      category: 'Food',
      date: new Date('2026-04-03'),
      notes: 'Groceries',
      createdBy: admin.id
    },
    {
      amount: 20000,
      type: 'INCOME' as const,
      category: 'Freelance',
      date: new Date('2026-03-15'),
      notes: 'Web project payment',
      createdBy: admin.id
    },
    {
      amount: 3000,
      type: 'EXPENSE' as const,
      category: 'Transport',
      date: new Date('2026-03-20'),
      notes: 'Monthly travel',
      createdBy: admin.id
    }
  ]

  for (const t of transactions) {
    await prisma.transaction.create({ data: t })
  }

  console.log('Database seeded successfully!')
  console.log('Users created:')
  console.log('  Admin:   admin@finance.com / password123')
  console.log('  Analyst: analyst@finance.com / password123')
  console.log('  Viewer:  viewer@finance.com / password123')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
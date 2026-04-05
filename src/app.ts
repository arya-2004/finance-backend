import userRoutes from './modules/users/user.routes'
import dashboardRoutes from './modules/dashboard/dashboard.routes'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import authRoutes from './modules/auth/auth.routes'
import transactionRoutes from './modules/transactions/transaction.routes'
dotenv.config()

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/users', userRoutes)

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
})
app.use('/api/auth', limiter)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/transactions', transactionRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Finance Backend is running!' })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Finance Backend Server running on http://localhost:${PORT}`)
})

export default app
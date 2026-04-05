import { Router } from 'express'
import { authenticate, authorize } from '../../middlewares/auth.middleware'
import {
  summary,
  categoryBreakdown,
  monthlyTrends,
  recentActivity,
  weeklySummary
} from './dashboard.controller'

const router = Router()

router.use(authenticate)

router.get('/summary', summary)
router.get('/recent-activity', recentActivity)
router.get('/category-breakdown', authorize('ADMIN', 'ANALYST'), categoryBreakdown)
router.get('/monthly-trends', authorize('ADMIN', 'ANALYST'), monthlyTrends)
router.get('/weekly-summary', authorize('ADMIN', 'ANALYST'), weeklySummary)

export default router
import { Router } from 'express'
import { authenticate, authorize } from '../../middlewares/auth.middleware'
import { create, getAll, getOne, update, remove } from './transaction.controller'

const router = Router()

// All routes require authentication
router.use(authenticate)

router.post('/', authorize('ADMIN'), create)
router.get('/', getAll)
router.get('/:id', getOne)
router.patch('/:id', authorize('ADMIN'), update)
router.delete('/:id', authorize('ADMIN'), remove)

export default router
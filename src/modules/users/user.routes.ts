import { Router } from 'express'
import { authenticate, authorize } from '../../middlewares/auth.middleware'
import { getAll, getOne, updateRole, updateStatus, remove } from './user.controller'

const router = Router()

router.use(authenticate)
router.use(authorize('ADMIN'))

router.get('/', getAll)
router.get('/:id', getOne)
router.patch('/:id/role', updateRole)
router.patch('/:id/status', updateStatus)
router.delete('/:id', remove)

export default router
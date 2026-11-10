import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { create, getGroup } from '../controllers/GroupController.js'

const router = Router()

router.use(auth)

router.post('/', create)
router.get('/:id', getGroup)

export default router

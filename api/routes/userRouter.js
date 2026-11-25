import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { login, logout, me, register } from '../controllers/UserController.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', auth, me)

export default router

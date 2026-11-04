import { Router } from 'express'
import { featured, getMovie, search } from '../controllers/MovieController.js'

const router = Router()

router.get('/featured', featured)
router.get('/search', search)
router.get('/:id', getMovie)

export default router

import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import {
  getMovieReviews,
  saveReview,
  editReview,
  removeReview
} from '../controllers/ReviewController.js'

const router = Router()

router.get('/movie/:movieId', getMovieReviews)
router.post('/movie/:movieId', auth, saveReview)
router.put('/:id', auth, editReview)
router.delete('/:id', auth, removeReview)

export default router

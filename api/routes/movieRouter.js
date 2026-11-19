import { Router } from 'express'
import {
  discover,
  featured,
  genres,
  getMovie,
  people,
  recommendations,
  search
} from '../controllers/MovieController.js'

const router = Router()

router.get('/featured', featured)
router.get('/search', search)
router.get('/discover', discover)
router.get('/genres', genres)
router.get('/people', people)
router.get('/:id/recommendations', recommendations)
router.get('/:id', getMovie)

export default router
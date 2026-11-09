import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import {
  getMyWatchlist,
  checkWatchlist,
  addMovie,
  removeMovie
} from '../controllers/WatchlistController.js'

const router = Router()

// Kaikki katselulistan reitit vaativat kirjautumisen
router.use(auth)

router.get('/', getMyWatchlist)
router.get('/:tmdbId', checkWatchlist)
router.post('/:tmdbId', addMovie)
router.delete('/:tmdbId', removeMovie)

export default router

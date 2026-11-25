import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import {
  getMyWatchlist,
  checkWatchlist,
  addMovie,
  removeMovie
} from '../controllers/WatchlistController.js'
import {
  getShareLink,
  createShareLink,
  revokeShareLink
} from '../controllers/WatchlistShareController.js'

const router = Router()

router.use(auth)

router.get('/share', getShareLink)
router.post('/share', createShareLink)
router.delete('/share', revokeShareLink)

router.get('/', getMyWatchlist)
router.get('/:tmdbId', checkWatchlist)
router.post('/:tmdbId', addMovie)
router.delete('/:tmdbId', removeMovie)

export default router

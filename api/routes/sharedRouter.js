import { Router } from 'express'
import { getSharedWatchlist } from '../controllers/WatchlistShareController.js'

const router = Router()

router.get('/watchlist/:token', getSharedWatchlist)

export default router

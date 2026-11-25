import 'dotenv/config'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import errorHandler from './middleware/errorHandler.js'
import testRouter from './routes/testRouter.js'
import userRouter from './routes/userRouter.js'
import movieRouter from './routes/movieRouter.js'
import reviewRouter from './routes/reviewRouter.js'
import watchlistRouter from './routes/watchlistRouter.js'
import groupRouter from './routes/groupRouter.js'
import sharedRouter from './routes/sharedRouter.js'

const app = express()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const frontendDist = path.join(__dirname, '..', 'dist')

app.set('trust proxy', 1)

const credentialOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())

app.use(cors((req, callback) => {
  const origin = req.header('Origin')
  callback(null, credentialOrigins.includes(origin) ? { origin, credentials: true } : { origin: '*' })
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/tests', testRouter)
app.use('/api/users', userRouter)
app.use('/api/movies', movieRouter)
app.use('/api/reviews', reviewRouter)
app.use('/api/watchlist', watchlistRouter)
app.use('/api/groups', groupRouter)
app.use('/api/shared', sharedRouter)

app.get('/api/health', async (req, res) => {
  try {
    const { pool } = await import('./models/db.js')
    await pool.query('SELECT 1')
    res.status(200).json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

app.use('/api', (req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use(express.static(frontendDist))

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'))
})

app.use(errorHandler)

export default app
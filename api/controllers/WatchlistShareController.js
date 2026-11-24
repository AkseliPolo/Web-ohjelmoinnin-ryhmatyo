import {
  findWatchlistLink,
  createWatchlistLink,
  revokeWatchlistLinks,
  findWatchlistOwnerByToken
} from '../models/ShareLink.js'
import { getWatchlist } from '../models/Watchlist.js'
import { httpError } from '../services/httpHelpers.js'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const toShareResponse = (link) => ({
  token: link.token,
  path: `/watchlist/shared/${link.token}`,
  createdAt: link.created_at
})

const getShareLink = async (req, res, next) => {
  try {
    const link = await findWatchlistLink(req.user.id)
    if (!link) throw httpError(404, 'Katselulistaa ei ole jaettu')
    res.status(200).json(toShareResponse(link))
  } catch (err) {
    next(err)
  }
}

const createShareLink = async (req, res, next) => {
  try {
    const existing = await findWatchlistLink(req.user.id)
    if (existing) return res.status(200).json(toShareResponse(existing))
    const link = await createWatchlistLink(req.user.id)
    res.status(201).json(toShareResponse(link))
  } catch (err) {
    next(err)
  }
}

const revokeShareLink = async (req, res, next) => {
  try {
    const revoked = await revokeWatchlistLinks(req.user.id)
    if (!revoked) throw httpError(404, 'Katselulistaa ei ole jaettu')
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

const getSharedWatchlist = async (req, res, next) => {
  try {
    const { token } = req.params
    const owner = UUID_PATTERN.test(token) ? await findWatchlistOwnerByToken(token) : null
    if (!owner) throw httpError(404, 'Jakolinkki on virheellinen tai poistettu käytöstä')
    const movies = await getWatchlist(owner.id)
    res.status(200).json({ owner: owner.display_name, movies })
  } catch (err) {
    next(err)
  }
}

export { getShareLink, createShareLink, revokeShareLink, getSharedWatchlist }

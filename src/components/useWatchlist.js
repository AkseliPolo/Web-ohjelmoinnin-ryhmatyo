import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../api'

// Kaikki katselulistan osoitteet yhdessä paikassa.
// Jos backendin reitit ovat erilaiset, muuta vain tätä.
const PATHS = {
  list: '/api/watchlist',
  item: (movieId) => `/api/watchlist/${movieId}`
}

const errorText = (err) =>
  err.status === 401 ? 'Kirjautuminen on vanhentunut, kirjaudu uudelleen sisään.' : err.message

// Elokuvan (TMDB) id listan riviltä
export const itemMovieId = (item) =>
  String(item.tmdb_id ?? item.tmdbId ?? item.movie_id ?? item.movieId)

export function useWatchlist() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    if (!user) return Promise.resolve()
    return apiFetch(PATHS.list)
      .then((data) => {
        setItems(Array.isArray(data) ? data : [])
        setError('')
      })
      .catch((err) => setError(errorText(err)))
      .finally(() => setLoading(false))
  }, [user])

  useEffect(() => {
    load()
  }, [load])

  const change = async (request) => {
    setBusy(true)
    setError('')
    try {
      await request()
      await load()
    } catch (err) {
      setError(errorText(err))
    } finally {
      setBusy(false)
    }
  }

  const add = (movieId) => change(() => apiFetch(PATHS.item(movieId), { method: 'POST' }))
  const remove = (movieId) => change(() => apiFetch(PATHS.item(movieId), { method: 'DELETE' }))

  const list = user ? items : []
  const has = (movieId) => list.some((item) => itemMovieId(item) === String(movieId))

  return {
    user,
    items: list,
    loading: Boolean(user) && loading,
    busy,
    error,
    has,
    add,
    remove
  }
}
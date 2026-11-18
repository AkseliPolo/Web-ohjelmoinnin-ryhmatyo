import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../api'

export function useMovieReviews(movieId) {
  const { user } = useAuth()
  const [data, setData] = useState({ movieId: null, list: [] })
  const [draft, setDraft] = useState(null)
  const [status, setStatus] = useState({ movieId: null, saving: false, error: '', message: '', needLogin: false })

  const reviews = data.movieId === movieId ? data.list : []
  const activeDraft = draft && draft.movieId === movieId ? draft : null
  const current = status.movieId === movieId ? status : { saving: false, error: '', message: '', needLogin: false }
  const myReview = user ? reviews.find((review) => review.user_id === user.id) : null

  const load = useCallback(() => {
    apiFetch(`/api/reviews/movie/${movieId}`)
      .then((list) => setData({ movieId, list: Array.isArray(list) ? list : [] }))
      .catch(() => setData({ movieId, list: [] }))
  }, [movieId])

  useEffect(() => {
    load()
  }, [load])

  const setCurrent = (changes) => setStatus({ ...current, movieId, ...changes })

  const chooseRating = (rating) => {
    if (!user) {
      setCurrent({ needLogin: true, message: '', error: '' })
      return
    }
    setDraft({
      movieId,
      rating,
      body: activeDraft ? activeDraft.body : (myReview?.body || '')
    })
    setCurrent({ needLogin: false, message: '', error: '' })
  }

  const setBody = (body) => setDraft({ ...activeDraft, body })

  const cancel = () => {
    setDraft(null)
    setCurrent({ error: '' })
  }

  const errorText = (err) =>
    err.status === 401 ? 'Kirjautuminen on vanhentunut, kirjaudu uudelleen sisään.' : err.message

  const save = async () => {
    if (!activeDraft) return
    setCurrent({ saving: true, error: '', message: '' })
    try {
      await apiFetch(`/api/reviews/movie/${movieId}`, {
        method: 'POST',
        body: JSON.stringify({ rating: activeDraft.rating, body: activeDraft.body.trim() || null })
      })
      setDraft(null)
      setStatus({ movieId, saving: false, error: '', message: 'Arvostelu tallennettu!', needLogin: false })
      load()
    } catch (err) {
      setStatus({ movieId, saving: false, error: errorText(err), message: '', needLogin: false })
    }
  }

  const remove = async () => {
    if (!myReview || !window.confirm('Poistetaanko arvostelusi?')) return
    setCurrent({ saving: true, error: '', message: '' })
    try {
      await apiFetch(`/api/reviews/${myReview.id}`, { method: 'DELETE' })
      setDraft(null)
      setStatus({ movieId, saving: false, error: '', message: 'Arvostelu poistettu.', needLogin: false })
      load()
    } catch (err) {
      setStatus({ movieId, saving: false, error: errorText(err), message: '', needLogin: false })
    }
  }

  return {
    user,
    reviews,
    myReview,
    draft: activeDraft,
    shownRating: activeDraft?.rating || myReview?.rating || 0,
    ...current,
    chooseRating,
    setBody,
    cancel,
    save,
    remove
  }
}

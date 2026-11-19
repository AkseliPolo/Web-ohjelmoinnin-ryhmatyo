import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import StarRating from '../components/StarRating'
import { ReviewForm, ReviewList } from '../components/MovieReviews'
import { useMovieReviews } from '../components/useMovieReviews'
import SimilarMovies from '../components/SimilarMovies'
import './movieinfo.css'

const API_URL = import.meta.env.VITE_API_URL || ''

function MovieDetailsPage() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const reviews = useMovieReviews(id)

  useEffect(() => {
    fetch(`${API_URL}/api/movies/${id}`)
      .then((response) => response.json())
      .then((data) => setMovie(data))
  }, [id])

  if (!movie) {
    return <p>Ladataan...</p>
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="container-fluid px-3 px-md-4 py-4 movie-layout">
        <div className="movie-poster-wrap">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="movie-poster rounded"
          />
        </div>

        <div className="movie-info">
          <div className="movie-title-row">
            <h1>{movie.title} ({movie.year})</h1>
            <StarRating
              value={reviews.shownRating}
              onChange={reviews.chooseRating}
              label="Arvostele elokuva"
            />
          </div>
          <p className="mb-1 mt-2">⭐ {movie.rating} · {movie.runtime} min</p>
          <p className="text-secondary">{movie.genres.join(', ')}</p>

          <ReviewForm reviews={reviews} />

          {movie.trailerKey && (
            <div style={{ position: 'relative' }} className="mb-4">
              {movie.backdropUrl && (
                <div
                  style={{
                    position: 'absolute',
                    inset: '-20px',
                    backgroundImage: `url(${movie.backdropUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(60px) saturate(1.6)',
                    opacity: 0.55,
                    zIndex: 0
                  }}
                />
              )}

              <div
                className="rounded overflow-hidden"
                style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', zIndex: 1 }}
              >
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${movie.trailerKey}`}
                  title={`${movie.title} - trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                />
              </div>
            </div>
          )}

          {movie.overview && (
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                borderRadius: '12px',
                padding: '1.5rem 1.75rem',
                backdropFilter: 'blur(6px)'
              }}
            >
              <p className="mb-0" style={{ lineHeight: 1.7, fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                {movie.overview}
              </p>
            </div>
          )}

          <ReviewList reviews={reviews} />
        </div>
      </div>

      <div className="container-fluid px-3 px-md-4 pb-4">
        <SimilarMovies movieId={id} />
      </div>
    </div>
  )
}

export default MovieDetailsPage
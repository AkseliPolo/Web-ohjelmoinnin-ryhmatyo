import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || ''

function MovieDetailsPage() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/api/movies/${id}`)
      .then((response) => response.json())
      .then((data) => setMovie(data))
  }, [id])

  if (!movie) {
    return <p>Ladataan...</p>
  }

  return (
    <div
      style={{
        minHeight: '100vh',
      }}
    >
      <div
        className="container-fluid px-4 py-4"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}
      >
        <div style={{ flex: '0 0 auto' }}>
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="img-fluid rounded"
            style={{ width: 427 }}
          />
        </div>

        <div style={{ flex: '1 1 500px', minWidth: 0 }}>
          <h1>{movie.title} ({movie.year})</h1>
          <p className="mb-1">⭐ {movie.rating} · {movie.runtime} min</p>
          <p className="text-secondary">{movie.genres.join(', ')}</p>

          {movie.trailerKey ? (
            <div style={{ position: 'relative' }} className="mb-4">
              {movie.backdropUrl && (
                <div
                  style={{
                    position: 'absolute',
                    inset: '-40px',
                    backgroundImage: `url(${movie.backdropUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(80px) saturate(1.6)',
                    opacity: 0.55,
                    zIndex: 0
                  }}
                />
              )}

              <div
                className="rounded overflow-hidden"
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 9',
                  zIndex: 1
                }}
              >
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${movie.trailerKey}`}
                  title={`${movie.title} - trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                />
              </div>
            </div>
          ) : (
            <p className="text-muted mb-4">Traileria ei löytynyt.</p>
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
        </div>
      </div>
    </div>
  )
}

export default MovieDetailsPage
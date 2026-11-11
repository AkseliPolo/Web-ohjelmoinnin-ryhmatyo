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
      <div
        className="mb-4 shadow rounded overflow-hidden"
        style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9' }}
      >
     <iframe
         src={`https://www.youtube-nocookie.com/embed/${movie.trailerKey}`}
         title={`${movie.title} - trailer`}
         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
         allowFullScreen
         style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
     />
     </div>
    ) : (
         <p className="text-muted mb-4">Traileria ei löytynyt.</p>
      )}
      
      <p className="lead">{movie.overview}</p>
    </div>
  </div>
  )
}

export default MovieDetailsPage
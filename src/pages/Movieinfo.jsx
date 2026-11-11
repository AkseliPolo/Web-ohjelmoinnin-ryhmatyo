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
<div className="row">
<div className="col-md-4">
<img src={movie.posterUrl} alt={movie.title} className="img-fluid rounded" />
</div>
 
      <div className="col-md-8">
<h1>{movie.title} ({movie.year})</h1>
<p>⭐ {movie.rating} · {movie.runtime} min</p>
<p>{movie.genres.join(', ')}</p>
<p>{movie.overview}</p>
</div>
</div>
  )
}
 
export default MovieDetailsPage
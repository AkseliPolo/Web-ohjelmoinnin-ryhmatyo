import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './featured.css'

const API_URL = import.meta.env.VITE_API_URL || ''
const SLIDE_MS = 6000

function FeaturedMovies() {
  const [movies, setMovies] = useState([])
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const ref = useRef(null)

  useLayoutEffect(() => {
    const fit = () => {
      const el = ref.current
      if (!el) return
      el.style.marginTop = '0px'
      el.style.marginTop = `-${el.getBoundingClientRect().top + window.scrollY}px`
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  useEffect(() => {
    fetch(`${API_URL}/api/movies/featured`)
      .then((response) => response.json())
      .then((data) => setMovies(data))
  }, [])

  useEffect(() => {
    if (movies.length < 2 || paused) return
    const timer = setTimeout(() => {
      setIndex((i) => (i + 1) % movies.length)
    }, SLIDE_MS)
    return () => clearTimeout(timer)
  }, [index, paused, movies.length])

  const go = (step) => setIndex((i) => (i + step + movies.length) % movies.length)

  return (
    <div className="featured" ref={ref}>
      <div className="featured-glow" aria-hidden="true">
        {movies.map((movie, i) => (
          <img
            key={movie.id}
            src={movie.backdropUrl}
            alt=""
            className={i === index ? 'active' : ''}
          />
        ))}
      </div>

      <div
        className="slider"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {movies.map((movie, i) => (
          <Link
            to={`/movies/${movie.id}`}
            className={`slide ${i === index ? 'active' : ''}`}
            key={movie.id}
            tabIndex={i === index ? 0 : -1}
          >
            <img src={movie.backdropUrl} alt={movie.title} />
            <p className="slide-title">{movie.title}</p>
          </Link>
        ))}

        {movies.length > 1 && (
          <>
            <button
              className="slider-arrow prev"
              type="button"
              aria-label="Edellinen elokuva"
              onClick={() => go(-1)}
            >
              ‹
            </button>
            
            <button
              className="slider-arrow next"
              type="button"
              aria-label="Seuraava elokuva"
              onClick={() => go(1)}
            >
              ›
            </button>
          </>
        )}
      </div>

      <div className="slider-dots">
        {movies.map((movie) => (
          <button
            key={movie.id}
            type="button"
            aria-label={movie.title}
            className={movies.indexOf(movie) === index ? 'active' : ''}
            onClick={() => setIndex(movies.indexOf(movie))}
          />
        ))}
      </div>
    </div>
  )
}

export default FeaturedMovies
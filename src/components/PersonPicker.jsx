import { useEffect, useState } from 'react'
import './personPicker.css'

const API_URL = import.meta.env.VITE_API_URL || ''

const DEPARTMENTS = {
  Acting: 'Näyttelijä',
  Directing: 'Ohjaaja',
  Writing: 'Käsikirjoittaja',
  Production: 'Tuottaja',
  Sound: 'Musiikki',
  Camera: 'Kuvaaja'
}

function PersonPicker({ placeholder, personName, onSelect, disabled }) {
  const [text, setText] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const query = text.trim()
    if (query.length < 2) return undefined

    let active = true
    const timer = setTimeout(() => {
      fetch(`${API_URL}/api/movies/people?q=${encodeURIComponent(query)}`)
        .then((response) => (response.ok ? response.json() : []))
        .then((data) => {
          if (active) setResults(Array.isArray(data) ? data : [])
        })
        .catch(() => {
          if (active) setResults([])
        })
    }, 300)

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [text])

  const choose = (person) => {
    onSelect(person)
    setText('')
    setResults([])
    setOpen(false)
  }

  if (personName) {
    return (
      <div className="person-chip form-control">
        <span>{personName}</span>
        <button
          type="button"
          aria-label={`Poista ${personName}`}
          onClick={() => onSelect(null)}
          disabled={disabled}
        >
          ×
        </button>
      </div>
    )
  }

  const showResults = open && text.trim().length >= 2 && results.length > 0

  return (
    <div className="person-picker">
      <input
        className="form-control"
        type="search"
        placeholder={placeholder}
        aria-label={placeholder}
        value={text}
        disabled={disabled}
        onChange={(event) => setText(event.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />

      {showResults && (
        <ul className="person-results">
          {results.map((person) => (
            <li key={person.id}>
              <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => choose(person)}>
                {person.profileUrl ? (
                  <img src={person.profileUrl} alt="" />
                ) : (
                  <span className="person-no-photo" />
                )}
                <span className="person-name">{person.name}</span>
                <small>{DEPARTMENTS[person.department] || person.department}</small>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PersonPicker

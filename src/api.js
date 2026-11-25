const API_URL = import.meta.env.VITE_API_URL || ''

// Tekee kutsun taustapalvelulle. Kirjautumisen eväste kulkee mukana automaattisesti.
export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const error = new Error(data?.error?.message || data?.error || data?.message || `Virhe ${response.status}`)
    error.status = response.status
    throw error
  }

  return data
}
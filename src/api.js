const API_URL = import.meta.env.VITE_API_URL || ''

// Tekee kutsun taustapalvelulle ja liittää mukaan kirjautumistokenin
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
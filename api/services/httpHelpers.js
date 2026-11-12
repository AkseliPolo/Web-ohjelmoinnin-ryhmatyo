const httpError = (status, message) => {
  const error = new Error(message)
  error.status = status
  return error
}

const parseId = (value) => {
  const id = Number(value)
  if (!Number.isInteger(id) || id < 1) throw httpError(400, 'Virheellinen id')
  return id
}

const parseOptionalInt = (value, fallback, min, max) => {
  if (value === undefined) return fallback
  const number = Number(value)
  if (!Number.isInteger(number) || number < min || number > max) {
    throw httpError(400, 'Virheellinen sivutus')
  }
  return number
}

export { httpError, parseId, parseOptionalInt }

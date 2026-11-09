import jwt from 'jsonwebtoken'

const unauthorized = (message) => {
  const error = new Error(message)
  error.status = 401
  return error
}

const auth = (req, res, next) => {
  const [type, token] = (req.headers.authorization || '').split(' ')

  if (type !== 'Bearer' || !token) {
    return next(unauthorized('Kirjautuminen vaaditaan'))
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: payload.id, username: payload.username }
    next()
  } catch {
    next(unauthorized('Virheellinen tai vanhentunut kirjautuminen'))
  }
}

export { auth }

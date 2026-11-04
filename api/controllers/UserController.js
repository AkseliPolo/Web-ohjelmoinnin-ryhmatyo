import bcrypt from 'bcryptjs'
import { createUser } from '../models/User.js'

const badRequest = (message) => {
  const error = new Error(message)
  error.status = 400
  return error
}

const FIELDS = ['username', 'displayName', 'email', 'password']
const USERNAME = /^[a-zA-Z0-9_]{3,30}$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const isStrongPassword = (password) =>
  password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password)

const checkRegistration = (body) => {
  if (FIELDS.some((field) => typeof body[field] !== 'string' || !body[field].trim())) {
    throw badRequest('Täytä kaikki kentät: username, displayName, email, password')
  }
  if (!USERNAME.test(body.username)) {
    throw badRequest('Käyttäjätunnus: 3–30 merkkiä, vain kirjaimet a–z, numerot ja _')
  }
  if (!EMAIL.test(body.email)) throw badRequest('Sähköpostiosoite on virheellinen')
  if (!isStrongPassword(body.password)) {
    throw badRequest('Salasanassa pitää olla vähintään 8 merkkiä, kirjain ja numero')
  }
}

const register = async (req, res, next) => {
  try {
    const body = req.body || {}
    checkRegistration(body)
    const { username, displayName, email, password } = body
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await createUser(username, displayName, email, passwordHash)
    res.status(201).json(user)
  } catch (error) {
    if (error.code === '23505') {
      error.status = 409
      error.message = 'Käyttäjätunnus tai sähköposti on jo käytössä'
    }
    next(error)
  }
}

export { register }

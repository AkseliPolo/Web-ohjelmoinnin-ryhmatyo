import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createUser, findUserForLogin } from '../models/User.js'

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

const unauthorized = () => {
  const error = new Error('Väärä käyttäjätunnus tai salasana')
  error.status = 401
  return error
}

const checkLogin = async (login, password) => {
  if (typeof login !== 'string' || typeof password !== 'string') throw unauthorized()
  const user = await findUserForLogin(login.trim())
  if (!user || !await bcrypt.compare(password, user.password_hash)) throw unauthorized()
  return user
}

const login = async (req, res, next) => {
  try {
    const { login, password } = req.body || {}
    const user = await checkLogin(login, password)
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.status(200).json({
      token,
      user: { id: user.id, username: user.username, display_name: user.display_name, email: user.email }
    })
  } catch (error) {
    next(error)
  }
}

export { register, login }

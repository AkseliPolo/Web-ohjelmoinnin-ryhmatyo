import { getMessages, createMessage } from '../models/GroupMessage.js'
import { requireMember } from '../services/groupAccess.js'
import { httpError, parseId, parseOptionalInt } from '../services/httpHelpers.js'

const MESSAGE_MAX = 4000

const listMessages = async (req, res, next) => {
  try {
    const groupId = parseId(req.params.id)
    await requireMember(groupId, req.user.id)

    const limit = parseOptionalInt(req.query.limit, 50, 1, 100)
    const beforeId = req.query.before === undefined ? null : parseId(req.query.before)

    const messages = await getMessages(groupId, limit, beforeId)
    res.status(200).json(messages.reverse())
  } catch (error) {
    next(error)
  }
}

const postMessage = async (req, res, next) => {
  try {
    const groupId = parseId(req.params.id)
    const { body } = req.body || {}

    if (typeof body !== 'string' || !body.trim()) {
      throw httpError(400, 'Viesti ei voi olla tyhjä')
    }
    if (body.trim().length > MESSAGE_MAX) {
      throw httpError(400, `Viesti saa olla enintään ${MESSAGE_MAX} merkkiä`)
    }

    await requireMember(groupId, req.user.id)

    const message = await createMessage(groupId, req.user.id, body.trim())
    res.status(201).json(message)
  } catch (error) {
    next(error)
  }
}

export { listMessages, postMessage }

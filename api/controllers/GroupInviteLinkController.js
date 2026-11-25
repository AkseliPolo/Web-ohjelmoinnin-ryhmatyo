import {
  getLinkProblem,
  createGroupInviteLink,
  listGroupInviteLinks,
  revokeGroupInviteLink,
  getInviteByToken,
  joinViaInvite
} from '../models/ShareLink.js'
import { requireAdmin } from '../services/groupAccess.js'
import { httpError, parseId } from '../services/httpHelpers.js'

const MAX_DAYS = 365
const MAX_USES = 1000
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const readOptionalInt = (value, max, label) => {
  if (value === undefined || value === null || value === '') return null
  const number = Number(value)
  if (!Number.isInteger(number) || number < 1 || number > max) {
    throw httpError(400, `${label} pitää olla kokonaisluku väliltä 1–${max}`)
  }
  return number
}

const readToken = (req) => {
  const token = req.params.token
  if (!UUID_PATTERN.test(token)) throw httpError(404, 'Kutsulinkkiä ei löytynyt')
  return token
}

const createLink = async (req, res, next) => {
  try {
    const groupId = parseId(req.params.id)
    await requireAdmin(groupId, req.user.id)

    const days = readOptionalInt(req.body?.expiresInDays, MAX_DAYS, 'Voimassaoloaika')
    const maxUses = readOptionalInt(req.body?.maxUses, MAX_USES, 'Käyttökertojen määrä')
    const expiresAt = days ? new Date(Date.now() + days * 24 * 60 * 60 * 1000) : null

    const link = await createGroupInviteLink(groupId, req.user.id, expiresAt, maxUses)
    res.status(201).json(link)
  } catch (error) {
    next(error)
  }
}

const listLinks = async (req, res, next) => {
  try {
    const groupId = parseId(req.params.id)
    await requireAdmin(groupId, req.user.id)
    res.status(200).json(await listGroupInviteLinks(groupId))
  } catch (error) {
    next(error)
  }
}

const revokeLink = async (req, res, next) => {
  try {
    const groupId = parseId(req.params.id)
    const linkId = parseId(req.params.linkId)
    await requireAdmin(groupId, req.user.id)

    const revoked = await revokeGroupInviteLink(groupId, linkId)
    if (!revoked) throw httpError(404, 'Linkkiä ei löytynyt tai se on jo peruttu')
    res.status(200).json({ id: revoked.id, revoked: true })
  } catch (error) {
    next(error)
  }
}

const previewInvite = async (req, res, next) => {
  try {
    const invite = await getInviteByToken(readToken(req), req.user.id)
    if (!invite) throw httpError(404, 'Kutsulinkkiä ei löytynyt')

    const reason = getLinkProblem(invite)
    res.status(200).json({
      group: {
        id: invite.group_id,
        name: invite.name,
        description: invite.description,
        member_count: invite.member_count
      },
      is_member: invite.my_role !== null,
      valid: reason === null,
      reason
    })
  } catch (error) {
    next(error)
  }
}

const joinInvite = async (req, res, next) => {
  try {
    const result = await joinViaInvite(readToken(req), req.user.id)

    if (result.code === 'not_found') throw httpError(404, 'Kutsulinkkiä ei löytynyt')
    if (result.code === 'invalid') throw httpError(410, result.message)

    res.status(200).json({
      group_id: result.groupId,
      already_member: result.code === 'already_member'
    })
  } catch (error) {
    next(error)
  }
}

export { createLink, listLinks, revokeLink, previewInvite, joinInvite }
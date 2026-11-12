import { groupExists } from '../models/Group.js'
import { getMemberRole } from '../models/GroupMember.js'
import { createRequest, getPendingRequests, decideRequest } from '../models/GroupRequest.js'
import { requireAdmin } from '../services/groupAccess.js'
import { httpError, parseId } from '../services/httpHelpers.js'

const DECISIONS = ['approved', 'rejected']

const requestToJoin = async (req, res, next) => {
  try {
    const groupId = parseId(req.params.id)

    if (!(await groupExists(groupId))) throw httpError(404, 'Ryhmää ei löytynyt')
    if (await getMemberRole(groupId, req.user.id)) {
      throw httpError(409, 'Olet jo ryhmän jäsen')
    }

    const request = await createRequest(groupId, req.user.id)
    res.status(201).json(request)
  } catch (error) {
    if (error.code === '23505') {
      return next(httpError(409, 'Liittymispyyntö on jo lähetetty'))
    }
    next(error)
  }
}

const getRequests = async (req, res, next) => {
  try {
    const groupId = parseId(req.params.id)
    await requireAdmin(groupId, req.user.id)
    res.status(200).json(await getPendingRequests(groupId))
  } catch (error) {
    next(error)
  }
}

const decide = async (req, res, next) => {
  try {
    const groupId = parseId(req.params.id)
    const requestId = parseId(req.params.requestId)
    const { status } = req.body || {}

    if (!DECISIONS.includes(status)) {
      throw httpError(400, 'Tilan pitää olla approved tai rejected')
    }

    await requireAdmin(groupId, req.user.id)

    const request = await decideRequest(groupId, requestId, req.user.id, status)
    if (!request) throw httpError(404, 'Pyyntöä ei löytynyt tai se on jo käsitelty')

    res.status(200).json(request)
  } catch (error) {
    next(error)
  }
}

export { requestToJoin, getRequests, decide }

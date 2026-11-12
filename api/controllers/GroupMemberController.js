import { getMembers, leaveGroup } from '../models/GroupMember.js'
import { requireMember } from '../services/groupAccess.js'
import { httpError, parseId } from '../services/httpHelpers.js'

const listMembers = async (req, res, next) => {
  try {
    const groupId = parseId(req.params.id)
    await requireMember(groupId, req.user.id)
    res.status(200).json(await getMembers(groupId))
  } catch (error) {
    next(error)
  }
}

const leave = async (req, res, next) => {
  try {
    const groupId = parseId(req.params.id)
    const result = await leaveGroup(groupId, req.user.id)

    if (result === 'not_member') {
      throw httpError(404, 'Et ole tämän ryhmän jäsen')
    }
    if (result === 'last_admin') {
      throw httpError(409, 'Olet ryhmän ainoa ylläpitäjä, joten et voi poistua ennen kuin ryhmässä on toinen ylläpitäjä')
    }

    res.status(200).json({ left: true, group_deleted: result === 'group_deleted' })
  } catch (error) {
    next(error)
  }
}

export { listMembers, leave }

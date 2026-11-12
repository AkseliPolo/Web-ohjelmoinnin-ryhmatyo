import { getMemberRole } from '../models/GroupMember.js'
import { groupExists } from '../models/Group.js'
import { httpError } from './httpHelpers.js'

const requireMember = async (groupId, userId) => {
  const role = await getMemberRole(groupId, userId)
  if (role) return role
  if (!(await groupExists(groupId))) throw httpError(404, 'Ryhmää ei löytynyt')
  throw httpError(403, 'Vain ryhmän jäsenet voivat tehdä tämän')
}

const requireAdmin = async (groupId, userId) => {
  const role = await requireMember(groupId, userId)
  if (role !== 'admin') throw httpError(403, 'Vain ryhmän ylläpitäjä voi tehdä tämän')
  return role
}

export { requireMember, requireAdmin }

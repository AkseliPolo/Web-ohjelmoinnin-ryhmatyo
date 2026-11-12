import { createGroup, getGroupById, listGroups } from '../models/Group.js'
import { httpError, parseId, parseOptionalInt } from '../services/httpHelpers.js'

const NAME_MAX = 100
const DESCRIPTION_MAX = 1000

const checkGroupInput = (body) => {
  const { name, description } = body || {}

  if (typeof name !== 'string' || !name.trim()) {
    throw httpError(400, 'Ryhmän nimi vaaditaan')
  }
  if (name.trim().length > NAME_MAX) {
    throw httpError(400, `Ryhmän nimi saa olla enintään ${NAME_MAX} merkkiä`)
  }
  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      throw httpError(400, 'Kuvauksen pitää olla teksti')
    }
    if (description.trim().length > DESCRIPTION_MAX) {
      throw httpError(400, `Kuvaus saa olla enintään ${DESCRIPTION_MAX} merkkiä`)
    }
  }

  return {
    name: name.trim(),
    description: typeof description === 'string' && description.trim() ? description.trim() : null
  }
}

const toGroupSummary = (group) => ({
  id: group.id,
  name: group.name,
  description: group.description,
  created_at: group.created_at,
  member_count: group.member_count,
  is_member: group.my_role !== null,
  my_role: group.my_role,
  has_pending_request: group.has_pending_request
})

const create = async (req, res, next) => {
  try {
    const { name, description } = checkGroupInput(req.body)
    const group = await createGroup(req.user.id, name, description)
    res.status(201).json({ ...group, member_count: 1, my_role: 'admin' })
  } catch (error) {
    next(error)
  }
}

const getGroup = async (req, res, next) => {
  try {
    const group = await getGroupById(parseId(req.params.id), req.user.id)
    if (!group) throw httpError(404, 'Ryhmää ei löytynyt')

    res.status(200).json({
      id: group.id,
      name: group.name,
      description: group.description,
      created_at: group.created_at,
      created_by: group.creator_id
        ? {
            id: group.creator_id,
            username: group.creator_username,
            display_name: group.creator_display_name
          }
        : null,
      member_count: group.member_count,
      is_member: group.my_role !== null,
      my_role: group.my_role,
      has_pending_request: group.has_pending_request
    })
  } catch (error) {
    next(error)
  }
}

const fetchGroups = async (req, onlyMine) => {
  const search =
    typeof req.query.search === 'string' && req.query.search.trim()
      ? req.query.search.trim()
      : null
  const limit = parseOptionalInt(req.query.limit, 20, 1, 50)
  const page = parseOptionalInt(req.query.page, 1, 1, 100000)

  const groups = await listGroups(req.user.id, {
    onlyMine,
    search,
    limit,
    offset: (page - 1) * limit
  })
  return groups.map(toGroupSummary)
}

const listAll = async (req, res, next) => {
  try {
    res.status(200).json(await fetchGroups(req, false))
  } catch (error) {
    next(error)
  }
}

const listMine = async (req, res, next) => {
  try {
    res.status(200).json(await fetchGroups(req, true))
  } catch (error) {
    next(error)
  }
}

export { create, getGroup, listAll, listMine }

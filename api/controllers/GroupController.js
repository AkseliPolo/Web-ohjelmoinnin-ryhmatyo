import { createGroup, getGroupById } from '../models/Group.js'

const NAME_MAX = 100
const DESCRIPTION_MAX = 1000

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
      my_role: group.my_role
    })
  } catch (error) {
    next(error)
  }
}

export { create, getGroup }

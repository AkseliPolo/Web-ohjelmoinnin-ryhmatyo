import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { create, getGroup, listAll, listMine } from '../controllers/GroupController.js'
import { requestToJoin, getRequests, decide } from '../controllers/GroupRequestController.js'
import { listMembers, leave } from '../controllers/GroupMemberController.js'
import { listMessages, postMessage } from '../controllers/GroupMessageController.js'
import {
  createLink,
  listLinks,
  revokeLink,
  previewInvite,
  joinInvite
} from '../controllers/GroupInviteLinkController.js'

const router = Router()

router.use(auth)

router.get('/', listAll)
router.get('/mine', listMine)
router.post('/', create)

router.get('/invites/:token', previewInvite)
router.post('/invites/:token/join', joinInvite)

router.get('/:id', getGroup)

router.post('/:id/requests', requestToJoin)
router.get('/:id/requests', getRequests)
router.patch('/:id/requests/:requestId', decide)

router.post('/:id/invite-links', createLink)
router.get('/:id/invite-links', listLinks)
router.delete('/:id/invite-links/:linkId', revokeLink)

router.get('/:id/members', listMembers)
router.delete('/:id/members/me', leave)

router.get('/:id/messages', listMessages)
router.post('/:id/messages', postMessage)

export default router
import express from 'express';
// controllers
import chatRoom from '../controllers/chatRoom.js';

const router = express.Router();

router
  .post('/', chatRoom.getRecentConversation)
  .get('/:roomId', chatRoom.getConversationByRoomId)
  .post('/initiate', chatRoom.initiate)
  .post('/:roomId/message', chatRoom.postMessage)
  .put('/:roomId/mark-read', chatRoom.markConversationReadByRoomId)

export default router;

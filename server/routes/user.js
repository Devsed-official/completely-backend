import express from 'express';
// controllers
import user from '../controllers/user.js';

const router = express.Router();

router
  .get('/:id', user.onGetUserById)
  .post('/:id', user.findAndUpdateUser)
  .post('/:id/updateDisplayPicture', user.updateDisplayPicture)
  // .get('/', user.onGetAllUsers)
  // .delete('/:id', user.onDeleteUserById)

export default router;

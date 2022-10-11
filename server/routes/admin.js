import express from 'express';
// controllers
import admin from '../controllers/admin.js';

const router = express.Router();

router
  .get('/users', admin.getAllUsers)
  .get('/professionals', admin.getAllProfessionals)
  // .post('/:id/updateDisplayPicture', admin.updateDisplayPicture)
  // .get('/', user.onGetAllUsers)
  // .delete('/:id', user.onDeleteUserById)

export default router;

import express from 'express';
// controllers
import admin from '../controllers/admin.js';

const router = express.Router();

router
  .post('/category/:categoryId', admin.updateCategory)
  .get('/users', admin.getAllUsers)
  .get('/professionals', admin.getAllProfessionals)
  .get('/orders', admin.getAllOrders)
  .get('/rooms', admin.getAllRooms)
  .get('/products', admin.getAllCategories)
  .post('/category', admin.createCategory)
  .delete('/category', admin.deleteCategory)
// .post('/:id/updateDisplayPicture', admin.updateDisplayPicture)
// .get('/', user.onGetAllUsers)
// .delete('/:id', user.onDeleteUserById)

export default router;

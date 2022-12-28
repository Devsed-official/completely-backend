import express from "express";
// controllers
import user from "../controllers/user.js";

const router = express.Router();

router
  .get("/categories", user.getAllCategories)
  .post("/category", user.getCategory)
  .post("/types", user.getProductTypes)
  .get("/:id", user.onGetUserById)
  .post("/:id", user.findAndUpdateUser)
  .get("/:id/home", user.init)
  .get("/:id/address", user.getAllAddress)
  .get("/:id/orders", user.getAllOrders)
  .post("/:id/:orderId/assignProfessional", user.assignProfessional)
  .post("/:id/updateAddress", user.updateUserAddress)
  // .post("/:id/updateCurrentLocation", user.init)
  .post("/:id/updateDisplayPicture", user.updateDisplayPicture)
  // .get('/', user.onGetAllUsers)
  .delete('/:id', user.onDeleteUserById)

export default router;


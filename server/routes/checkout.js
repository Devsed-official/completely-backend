import express from "express";
// controllers
import checkout from "../controllers/checkout.js";

const router = express.Router();
router
.post("/createOrder", checkout.createOrder)
.post("/:id/updateOrder", checkout.updateOrderStatus)
// .post("/:id", checkout.findAndUpdateUser);

export default router;

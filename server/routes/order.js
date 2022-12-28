import express from "express";
import order from "../controllers/order.js";
// controllers

const router = express.Router();

router
  .post("", order.getOrderDetails)

export default router;
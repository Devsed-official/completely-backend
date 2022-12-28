// utils
import makeValidation from "@withvoid/make-validation";
// models
import ProfessionalModel from "../models/Professional.js";
import UserModel from "../models/User.js";
import JobCategoryModel from "../models/JobDetails.js";

import path from "path";
import Order from "../models/Order.js";
import ChatRoom from "../models/ChatRoom.js";
import JobDetails from "../models/JobDetails.js";

const __dirname = path.resolve();
export default {
  getAllUsers: async (req, res) => {
    try {
      const users = await UserModel.getUsers();
      return res.status(200).json({ success: true, users });
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  },
  getAllProfessionals: async (req, res) => {
    try {
      const professionals = await ProfessionalModel.getProfessionals();
      return res.status(200).json({ success: true, professionals });
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  },
  getAllCategories: async (req, res) => {
    try {
      const products = await JobCategoryModel.getJobCategories();
      return res.status(200).json({ success: true, products });
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  },
  createCategory: async (req, res) => {
    try {
      const category = await JobCategoryModel.createJobCategory(req.body);
      return res.status(200).json({ success: true, category });
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const category = await JobCategoryModel.deleteJobCategory(req.body.id);
      return res.status(200).json({ success: true, category });
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  },
  deleteAllCategories: async (req, res) => {
    try {
      const category = await JobCategoryModel.deleteAllJobCategory();
      return res.status(200).json({ success: true, category });
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  },
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.getAllOrders();
      return res.status(200).json({ success: true, orders });
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  },
  getAllRooms: async (req, res) => {
    try {
      const rooms = await ChatRoom.getAllChatRooms();
      return res.status(200).json({ success: true, rooms });
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const category = await JobDetails.findAndUpdateJobCategory(req.params.categoryId, req.body);
      return res.status(200).json({ success: true, category });
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  }
};

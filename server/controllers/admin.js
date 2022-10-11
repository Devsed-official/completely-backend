// utils
import makeValidation from "@withvoid/make-validation";
// models
import ProfessionalModel from "../models/Professional.js";
import UserModel from "../models/User.js";

import path from "path";

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
};

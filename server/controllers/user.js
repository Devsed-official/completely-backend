// utils
import makeValidation from "@withvoid/make-validation";
// models
import UserModel, { USER_ROLES, USER_GENDER_OPTIONS } from "../models/User.js";
import path from "path";
import JobDetails from "../models/JobDetails.js";
import Order from "../models/Order.js";

const __dirname = path.resolve();
export default {
  init: async (req, res) => {
    try {
      const heroImages = [
        {
          url: "public/bannerImages/banner1.png",
        },
        {
          url: "public/bannerImages/banner2.png",
        },
      ];
      const secondHeroImages = [...heroImages];
      const products = await JobDetails.getJobCategories();
      const userObj = await UserModel.getUserById(req.params.id);
      let currentAdd = userObj.savedAddresses.filter(
        (a) => String(a._id) === String(userObj.currentAddress)
      );
      return res.status(200).json({
        success: true,
        response: {
          heroImages,
          secondHeroImages,
          products,
          userCurrentAddress: currentAdd[0],
        },
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err });
    }
  },
  onGetUserById: async (req, res) => {
    try {
      const user = await UserModel.getUserById(req.params.id);
      return res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  findAndUpdateUser: async (req, res) => {
    try {
      const user = await UserModel.findAndUpdateUser(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  updateDisplayPicture: async (req, res) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
      }
      var re = /(?:\.([^.]+))?$/;
      let file = req.files.displayPicture;
      let fileExt = re.exec(file.name);
      let path =
        __dirname + `/content/displayPictures/${req.params.id}${fileExt[0]}`;
      await file.mv(path, async (err) => {
        if (err) {
          return res.status(500).json({ success: false, error: err });
        }
        const user = await UserModel.findAndUpdateUserDisplayPicture(
          req.params.id,
          `/public/displayPictures/${req.params.id}${fileExt[0]}`
        );
        return res.status(200).json({
          success: true,
          user,
        });
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  getAllAddress: async (req, res) => {
    try {
      const user = await UserModel.getUserById(req.params.id);
      return res.status(200).json({
        success: true,
        userId: user._id,
        address: user.savedAddresses,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  },
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.getOrderDetailsByUserId(req.params.id);
      // orders.map(order=>{
      //   let allProducts
      // })
      return res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  },
  updateUserAddress: async (req, res) => {
    try {
      const user = await UserModel.updateUserLocation(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        user: user,
        savedAddress: user.savedAddresses,
        currentAddress: user.currentAddress,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  },
  assignProfessional: async (req, res) => {
    try {
      const order = await Order.updateStatus(req.params.orderId, {
        assignedProfessionalId: req.body.professionalId,
        status: "assigned",
      });
      res.status(200).json({ success: true, order });
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  },
  onDeleteUserById: async (req, res) => {
    try {
      const user = await UserModel.deleteByUserById(req.params.id);
      return res.status(200).json({
        success: true,
        message: `Deleted a count of ${user.deletedCount} user.`,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  getAllCategories: async (req, res) => {
    try {
      const products = await JobDetails.getJobCategories();
      res.status(200).json({ success: true, products });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  getCategory: async (req, res) => {
    try {
      const category = await JobDetails.getJobCategory(req.body);
      res.status(200).json({ success: true, category });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  getProductTypes: async (req, res) => {
    try {
      const category = await JobDetails.getJobTypes(req.body);
      res.status(200).json({ success: true, category });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
};

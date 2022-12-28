// utils
import makeValidation from "@withvoid/make-validation";
// models
import ProfessionalModel from "../models/Professional.js";

import path from "path";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Business from "../models/Business.js";

const __dirname = path.resolve();
export default {
  getProfessionalDetails: async (req, res) => {
    try {
      const professional = await ProfessionalModel.getProfessionalById(
        req.params.id
      );
      if (professional)
        return res.status(200).json({ success: true, professional });
      return res
        .status(400)
        .json({
          success: false,
          message: "Professional not found, please try again with another Id",
        });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  getCategories: async (req, res) => {
    try {
      // const categories = [{
      //   name: "Cleaning",
      //   subcategories: [{
      //     name: "Home Cleaning"
      //   }]
      // }]
      return res.status(200).json({ success: true, professional });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  findAndUpdateProfessional: async (req, res) => {
    try {
      const professional = await ProfessionalModel.findAndUpdateProfessional(
        req.params.id,
        req.body
      );
      return res.status(200).json({
        success: true,
        professional,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  createBusinessDetails: async (req, res) => {
    try {
      const business = await Business.createBusiness(req.body, req.params.id);
      return res.status(200).json({
        success: true,
        business,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  uploadProfessionalDoc: async (req, res) => {
    try {
      console.log(req);
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
      }
      var re = /(?:\.([^.]+))?$/;
      let file = req.files.document;
      let fileExt = re.exec(file.name);
      let path =
        __dirname +
        `/content/documents/${req.params.id}_${req.params.docType}${fileExt[0]}`;
      await file.mv(path, async (err) => {
        if (err) {
          return res.status(500).json({ success: false, error: err });
        }
        try {
          console.log("working");
          const professional =
            await ProfessionalModel.findAndUpdateProfessionalDocuments(
              req.params.id,
              {
                key: `${req.params.docType}Url`,
                value: `/public/documents/${req.params.id}_${req.params.docType}${fileExt[0]}`,
              }
            );
          return res.status(200).json({
            success: true,
            professional,
          });
        } catch (error) {
          return res.status(500).json({ success: false, error: error });
        }
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  updatePreferences: async (req, res) => {
    try {
      const professional = await ProfessionalModel.findAndUpdateProfessional(
        req.params.id,
        req.body
      );
      return res.status(200).json({
        success: true,
        professional,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
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
      const openJobs = await Order.getAllActiveOrders();
      const userObj = await User.getUserById(req.params.id);
      let currentAdd = userObj.savedAddresses.filter(
        (a) => String(a._id) === String(userObj.currentAddress)
      );
      return res.status(200).json({
        success: true,
        response: {
          heroImages,
          secondHeroImages,
          openJobs,
          outsideJobs: openJobs,
          userCurrentAddress: currentAdd[0],
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  applyJob: async (req, res) => {
    try {
      const order = await Order.applyJob(req.body.orderId, req.params.id);
      return res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
};

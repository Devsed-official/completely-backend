// utils
import makeValidation from "@withvoid/make-validation";
// models
import ProfessionalModel from "../models/Professional.js";

import path from "path";

const __dirname = path.resolve();
export default {
  getProfessionalDetails: async (req, res) => {
    try {
      const professional = await ProfessionalModel.getProfessionalById(
        req.params.id
      );
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
  uploadProfessionalDoc: async (req, res) => {
    try {
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
        try{
          console.log('working')
          const professional = await ProfessionalModel.findAndUpdateProfessionalDocuments(
            req.params.id,
            {
              key: `${req.params.docType}Url`,
              value: `/public/documents/${req.params.id}_${req.params.docType}${fileExt[0]}`
            }
          );
          return res.status(200).json({
            success: true,
            professional,
          });
        }
        catch (error){
          return res.status(500).json({ success: false, error: error });
        }
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
};

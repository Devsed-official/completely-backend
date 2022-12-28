import express from "express";
// controllers
import professional from "../controllers/professional.js";

const router = express.Router();

router
  .get("/:id", professional.getProfessionalDetails)
  .post("/:id", professional.findAndUpdateProfessional)
  .post("/:id/addBusiness", professional.createBusinessDetails)
  .post("/:id/updateBusiness/:businessId", professional.createBusinessDetails)
  .get("/:id/home", professional.init)
  .post("/:id/updatePreferences", professional.updatePreferences)
  .post("/:id/applyJob", professional.applyJob)
  .post("/:id/uploadDoc/:docType", professional.uploadProfessionalDoc);

export default router;
import express from "express";
// controllers
import professional from "../controllers/professional.js";

const router = express.Router();

router
  .get("/:id", professional.getProfessionalDetails)
  .post("/:id", professional.findAndUpdateProfessional)
  .post("/:id/uploadDoc/:docType", professional.uploadProfessionalDoc);

export default router;
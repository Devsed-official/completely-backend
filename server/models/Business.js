import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const businessSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4().replace(/\-/g, ""),
  },
  businessName: String,
  businessRegistrationNumber: String,
  businessInsurance: String,
  taxDetails: {
    gstRegistered: Boolean,
    gstNumber: String,
  },
});

export default mongoose.model("Business", businessSchema);

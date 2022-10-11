import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Address from "./Address";

const jobSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4().replace(/\-/g, ""),
  },
  category: String,
  subCategory: String,
  scheduledAt: Date,
  customerId: String,
  address: Address,
  
});

export default mongoose.model("Job", jobSchema);


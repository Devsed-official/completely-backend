import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Professional from "./Professional.js";

const businessSchema = new mongoose.Schema({
  businessName: String,
  businessRegistrationNumber: String,
  businessInsurance: Boolean,
  taxDetails: {
    gstRegistered: Boolean,
    gstNumber: String,
  },
});

businessSchema.statics.createBusiness = async function (businessObj, professionalId) {
  try {
    const business = await this.create(businessObj);
    const professional = await Professional.findAndUpdateProfessional(professionalId, {
      businessDetailsId: business._id
    });
    return business;
  } catch (error) {
    throw error;
  }
};

businessSchema.statics.findAndUpdateBusiness = async function (businessId, businessObj) {
  try {
    const business = await this.findByIdAndUpdate(businessId, businessObj, {
      new: true,
    });
    return business;
  } catch (error) {
    throw error;
  }
};

businessSchema.statics.getBusinessById = async function (businessId) {
  try {
    const business = await this.find({ _id: businessId });
    return business;
  } catch (error) {
    throw error;
  }
};

export default mongoose.model("Business", businessSchema);

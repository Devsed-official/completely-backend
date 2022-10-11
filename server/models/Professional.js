import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const PROFESSIONAL_BUSINESS_TYPE = {
  FREELANCER: "freelancer",
  BUSINESS: "business",
};

export const PROFESSIONAL_STATUS = {
  IN_PROGRESS: "in progress",
  UNDER_REVIEW: "under review",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const TRAINING_STATUS = {
  PENDING: "pending",
  SCHEDULED: "scheduled",
  COMPLETED: "completed",
};

const specializationSchema = new mongoose.Schema({
  category: String,
  subCategory: [String],
  yearsOfExp: Number,
});

const professionalSchema = new mongoose.Schema(
  {
    _id: String,
    businessType: String,
    professionalStatus: String,
    trainingStatus: String,
    specializations: [specializationSchema],
    languagesSpoken: [String],
    policeCheck: String,
    personalInformation: {
      ahvUrl: String,
      resumeUrl: String,
      qualificationDocumentUrl: String,
      workPermitUrl: String,
      legalPermitUrl: String,
      ownershipProofUrl: String,
      driversLicenseUrl: String,
      passportUrl: String,
      identityCardFrontUrl: String,
      identityCardBackUrl: String,
      verificationVideoUrl: String,
    },
    businessDetailsId: String,
    // photoVerified: Boolean,
    videoVerified: Boolean,
    vehicleInformation: String,
    preferredNoOfWorkingHours: Number,
    equipmentAvailable: Boolean,
    tshirtSize: String,
  },
  {
    timestamps: true,
    collection: "professionals",
  }
);

professionalSchema.statics.getProfessionalById = async function (
  professionalId
) {
  try {
    const aggregate = await this.aggregate([
      { $match: { _id: professionalId } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
    ]);
    return aggregate[0];
  } catch (error) {
    throw error;
  }
};

professionalSchema.statics.findAndUpdateProfessional = async function (
  professionalId,
  professionalObj
) {
  try {
    const professional = await this.findByIdAndUpdate(
      professionalId,
      professionalObj,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
    return professional;
  } catch (error) {
    throw error;
  }
};

professionalSchema.statics.findAndUpdateProfessionalDocuments = async function (
  professionalId,
  professionalObj
) {
  try {
    const professional = await this.findByIdAndUpdate(
      professionalId,
      {
        [`personalInformation.${professionalObj.key}`]:professionalObj.value
      },
      {
        new: true,
      }
    );
    return professional;
  } catch (error) {
    throw error;
  }
};

/**
 * @return {Array} List of all users
 */
 professionalSchema.statics.getProfessionals = async function () {
  try {
    const professionals = await this.find();
    return professionals;
  } catch (error) {
    throw error;
  }
};

export default mongoose.model("Professional", professionalSchema);

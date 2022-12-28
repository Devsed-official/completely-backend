import mongoose from "mongoose";

const extraOptions = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  price: String,
  tag: String,
  estimatedWorkTime: String,
})

const option = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  price: String,
  addonPrice: String,
  unit: String,
  tag: String,
  chargePerUnit: String,
  standardUnitSize: String,
  estimatedWorkTime: String,
  includedAddons: [{
    tag: String,
    noOfInclusions: Number
  }],
  extras: [extraOptions]
});

const addonsOption = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  tag: String,
  defaultPrice: String,
  defaultEstimatedWorkTime: String,
  options: [{
    title: String,
    price: String,
    estimatedWorkTime: String,
    description: String,
  }],
});

const jobCategory = new mongoose.Schema({
  title: String,
  description: String,
  tag: String,
  imageUrl: String,
  options: [option],
  types: [String]
});

const jobDetails = new mongoose.Schema(
  {
    title: String,
    description: String,
    imageUrl: String,
    categories: [jobCategory],
    addons: [addonsOption],
    extras: [extraOptions],
    tag: String,
    type: String,
    serviceFee: Number,
    vat: Number
  },
  {
    timestamps: true,
    collection: "jobDetails",
  });

jobDetails.statics.getJobCategories = async function () {
  try {
    const categories = await this.find();
    return categories;
  } catch (error) {
    throw error;
  }
};

jobDetails.statics.getJobCategory = async function (tag) {
  try {
    const category = await this.findOne(tag);
    return category;
  } catch (error) {
    throw error;
  }
}

jobDetails.statics.getJobTypes = async function (type) {
  try {
    const category = await this.find(type);
    return category;
  } catch (error) {
    throw error;
  }
}

jobDetails.statics.getJobDetailsByIds = async function (ids) {
  try {
    const categories = await this.find({ _id: { $in: ids } }).lean();
    return categories;
  } catch (error) {
    throw error;
  }
};

jobDetails.statics.createJobCategory = async function (categoryObj) {
  try {
    const categories = await this.create(categoryObj);
    return categories;
  } catch (error) {
    throw error;
  }
};

jobDetails.statics.deleteJobCategory = async function (categoryId) {
  try {
    const category = await this.findByIdAndRemove(categoryId);
    return category;
  } catch (error) {
    throw error;
  }
};

jobDetails.statics.deleteAllJobCategory = async function (categoryId) {
  try {
    const category = await this.deleteMany({});
    return category;
  } catch (error) {
    throw error;
  }
};

jobDetails.statics.findAndUpdateJobCategory = async function (
  categoryId,
  categoryObj
) {
  try {
    const category = await this.findByIdAndUpdate(categoryId, categoryObj, {
      new: true,
    });
    return category;
  } catch (error) {
    throw error;
  }
};

export default mongoose.model("JobDetails", jobDetails);

import mongoose from "mongoose";
import AddressSchema from "./Address.js";

export const USER_ROLES = {
  CUSTOMER: "customer",
  PROFESSIONAL: "professional",
};
export const USER_GENDER_OPTIONS = {
  MALE: "male",
  FEMALE: "female",
  OTHERS: "others",
  PREFERRED_NOT_TO_SAY: "preferred not to say",
};

const userSchema = new mongoose.Schema(
  {
    _id: String,
    stripeId: String,
    firstName: String,
    lastName: String,
    bio: String,
    email: String,
    dob: String,
    phoneNumber: String,
    role: String,
    gender: String,
    preferredLanguage: String,
    displayPictureUrl: String,
    orders: [String],
    currentAddress: String,
    savedAddresses: [AddressSchema],
    acceptedTermsAndConditions: Boolean,
    joinedCommunity: Boolean,
    acceptedPrivacyPolicy: Boolean
  },
  {
    timestamps: true,
    collection: "users",
  }
);

/**
 * @param {String} firstName
 * @param {String} lastName
 * @returns {Object} new user object created
 */
// userSchema.statics.createUser = async function (userObj) {
//   try {
//     const user = await this.create(userObj);
//     return user;
//   } catch (error) {
//     throw error;
//   }
// };

userSchema.statics.findAndUpdateUser = async function (userId, userObj) {
  try {
    const user = await this.findByIdAndUpdate(userId, userObj, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }).lean();
    return user;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.findAndUpdateUserDisplayPicture = async function (
  userId,
  displayPictureUrl
) {
  try {
    const user = await this.findByIdAndUpdate(
      userId,
      { displayPictureUrl },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * @param {String} id, user id
 * @return {Object} User profile object
 */
userSchema.statics.getUserById = async function (id) {
  try {
    const user = await this.findOne({ _id: id });
    if (!user) throw { error: "No user with this id found" };
    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * @return {Array} List of all users
 */
userSchema.statics.getUsers = async function () {
  try {
    const users = await this.find();
    return users;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.updateUserLocation = async function (userId, body) {
  try {
    let userExists = await this.find({
      "savedAddresses.lat": body.lat,
      "savedAddresses.long": body.long,
      "savedAddresses.placeId": body.placeId,
    });
    if (userExists.length) {
      let currentAdd = userExists[0].savedAddresses.filter(
        (a) => a.lat === body.lat && a.long === body.long
      );
      const users = await this.findByIdAndUpdate(
        userId,
        { currentAddress: currentAdd[0]._id },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
      return users;
    }
    const addressId = new mongoose.Types.ObjectId();
    body._id = addressId;
    const users = await this.findByIdAndUpdate(
      userId,
      { $push: { savedAddresses: body }, currentAddress: addressId },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
    return users;
  } catch (error) {
    throw error;
  }
};
// /**
//  * @param {Array} ids, string of user ids
//  * @return {Array of Objects} users list
//  */
userSchema.statics.getUserByIds = async function (ids) {
  try {
    const users = await this.find({ _id: { $in: ids } });
    return users;
  } catch (error) {
    throw error;
  }
};

// /**
//  * @param {String} id - id of user
//  * @return {Object} - details of action performed
//  */
userSchema.statics.deleteByUserById = async function (id) {
  try {
    const result = await this.remove({ _id: id });
    return result;
  } catch (error) {
    throw error;
  }
};

export default mongoose.model("User", userSchema);

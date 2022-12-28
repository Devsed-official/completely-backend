import mongoose from "mongoose";
import User from "./User.js";

export const STATUS = {
  CREATED: "created",
  PAID: "paid",
  FAILED: "failed",
  ASSIGNED: "assigned",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
};

const productListSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  categoryId: mongoose.Schema.Types.ObjectId,
  optionId: mongoose.Schema.Types.ObjectId,
  extraId: mongoose.Schema.Types.ObjectId,
  extraQuantity: Number,
  quantity: Number,
  custom: mongoose.Schema.Types.Mixed
});

const addonsSchema = new mongoose.Schema({
  optionId: String,
  selectedOptionId: String,
  productId: mongoose.Schema.Types.ObjectId,
  quantity: Number
});

const orderSchema = new mongoose.Schema(
  {
    status: String,
    products: [productListSchema],
    addOns: [addonsSchema],
    subTotal: Number,
    serviceFee: Number,
    vat: Number,
    grandTotal: Number,
    transactionId: String,
    userId: String,
    tag: String,
    assignedProfessionalId: String,
    potentialProfessionals: [String],
    address: mongoose.Schema.Types.ObjectId,
    scheduledTimeOfService: String,
    additionalDetails: mongoose.Schema.Types.Mixed,
    scheduledTimeOfService: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

orderSchema.statics.createOrder = async function (orderObj) {
  try {
    const order = await this.create(orderObj);
    const user = await User.findAndUpdateUser(orderObj.userId, {
      $push: {
        orders: order._id,
      },
    });
    return order;
  } catch (error) {
    throw error;
  }
};

orderSchema.statics.updateStatus = async function (orderId, statusObj) {
  try {
    const order = await this.findByIdAndUpdate(orderId, statusObj, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
    const orders = await this.aggregate([
      {
        $match: { _id: order._id }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$potentialProfessionals",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "potentialProfessionals",
          foreignField: "_id",
          as: "potentialProfessionalDetails",
        },
      },
      {
        $unwind: {
          path: "$potentialProfessionalDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "address",
          foreignField: "savedAddresses._id",
          as: "addressDetails",
        },
      },
      { $unwind: "$addressDetails" },
      {
        $unwind: {
          path: "$products",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "jobDetails",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetails.details",
        },
      },
      {
        $unwind: {
          path: "$productDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: "$addOns",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "jobDetails",
          localField: "addOns.productId",
          foreignField: "_id",
          as: "addonDetails.details",
        },
      },
      {
        $unwind: {
          path: "$addonDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      // { $unwind: "$addonDetails" },
      // // { $unwind: "$potentialProfessionals" },
      {
        $group: {
          _id: "$_id",
          status: { $last: "$status" },
          assignedDetails: { $last: "$assignedDetails" },
          userDetails: { $last: "$userDetails" },
          tag: { $last: "$tag" },
          grandTotal: { $last: "$grandTotal" },
          subTotal: { $last: "$subTotal" },
          serviceFee: { $last: "$serviceFee" },
          vat: { $last: "$vat" },
          additionalDetails: { $last: "$additionalDetails" },
          address: {
            $last: {
              $filter: {
                input: '$addressDetails.savedAddresses',
                as: 'addressDetails',
                cond: { $eq: ['$$addressDetails._id', '$address'] }
              }
            }
          },
          potentialProfessionals: { $last: "$potentialProfessionals" },
          scheduledTimeOfService: { $last: "$scheduledTimeOfService" },
          products: { $push: { $mergeObjects: ["$products", "$productDetails"] } },
          potentialProfessionalDetails: { $push: "$potentialProfessionalDetails" },
          // addOns: { $last: "$addOns"}
          addons: { $push: { $mergeObjects: ["$addOns", "$addonDetails"] } },
        },
      }
    ]);
    return orders[0];
  } catch (error) {
    throw error;
  }
};

orderSchema.statics.applyJob = async function (orderId, professionalId) {
  try {
    const order = await this.findByIdAndUpdate(
      orderId,
      { status: "applied", $push: { potentialProfessionals: professionalId } },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
    const orders = await this.aggregate([
      {
        $match: { _id: order._id }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "assignedProfessionalId",
          foreignField: "_id",
          as: "assignedDetails",
        },
      },
      {
        $unwind: {
          path: "$potentialProfessionals",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "potentialProfessionals",
          foreignField: "_id",
          as: "potentialProfessionalDetails",
        },
      },
      {
        $unwind: {
          path: "$potentialProfessionalDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "address",
          foreignField: "savedAddresses._id",
          as: "addressDetails",
        },
      },
      { $unwind: "$addressDetails" },
      {
        $unwind: {
          path: "$products",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "jobDetails",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetails.details",
        },
      },
      {
        $unwind: {
          path: "$productDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: "$addOns",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "jobDetails",
          localField: "addOns.productId",
          foreignField: "_id",
          as: "addonDetails.details",
        },
      },
      {
        $unwind: {
          path: "$addonDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      // { $unwind: "$addonDetails" },
      // // { $unwind: "$potentialProfessionals" },
      {
        $group: {
          _id: "$_id",
          status: { $last: "$status" },
          assignedDetails: { $last: "$assignedDetails" },
          userDetails: { $last: "$userDetails" },
          tag: { $last: "$tag" },
          grandTotal: { $last: "$grandTotal" },
          subTotal: { $last: "$subTotal" },
          serviceFee: { $last: "$serviceFee" },
          vat: { $last: "$vat" },
          additionalDetails: { $last: "$additionalDetails" },
          address: {
            $last: {
              $filter: {
                input: '$addressDetails.savedAddresses',
                as: 'addressDetails',
                cond: { $eq: ['$$addressDetails._id', '$address'] }
              }
            }
          },
          potentialProfessionals: { $last: "$potentialProfessionals" },
          scheduledTimeOfService: { $last: "$scheduledTimeOfService" },
          products: { $push: { $mergeObjects: ["$products", "$productDetails"] } },
          potentialProfessionalDetails: { $push: "$potentialProfessionalDetails" },
          // addOns: { $last: "$addOns"}
          addons: { $push: { $mergeObjects: ["$addOns", "$addonDetails"] } },
        },
      }
    ]);
    return orders[0];
  } catch (error) {
    throw error;
  }
};

orderSchema.statics.getOrdersByUserId = async function (userId) {
  try {
    const orders = this.find({ userId });
    return orders;
  } catch (error) {
    throw error;
  }
};

orderSchema.statics.getAllOrders = async function () {
  try {
    const orders = this.find();
    return orders;
  } catch (error) {
    throw error;
  }
};

orderSchema.statics.getAllActiveOrders = async function () {
  try {
    const orders = await this.aggregate([
      {
        $match: {
          $or: [
            { status: "paid" },
            { status: "applied" },
            { status: "assigned" },
          ]
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "assignedProfessionalId",
          foreignField: "_id",
          as: "assignedDetails",
        },
      },
      {
        $unwind: {
          path: "$potentialProfessionals",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "potentialProfessionals",
          foreignField: "_id",
          as: "potentialProfessionalDetails",
        },
      },
      {
        $unwind: {
          path: "$potentialProfessionalDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "address",
          foreignField: "savedAddresses._id",
          as: "addressDetails",
        },
      },
      { $unwind: "$addressDetails" },
      {
        $unwind: {
          path: "$products",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "jobDetails",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetails.details",
        },
      },
      {
        $unwind: {
          path: "$productDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: "$addOns",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "jobDetails",
          localField: "addOns.productId",
          foreignField: "_id",
          as: "addonDetails.details",
        },
      },
      {
        $unwind: {
          path: "$addonDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      // { $unwind: "$addonDetails" },
      // // { $unwind: "$potentialProfessionals" },
      {
        $group: {
          _id: "$_id",
          assignedDetails: { $last: "$assignedDetails" },
          userDetails: { $last: "$userDetails" },
          status: { $last: "$status" },
          tag: { $last: "$tag" },
          grandTotal: { $last: "$grandTotal" },
          subTotal: { $last: "$subTotal" },
          serviceFee: { $last: "$serviceFee" },
          vat: { $last: "$vat" },
          additionalDetails: { $last: "$additionalDetails" },
          address: {
            $last: {
              $filter: {
                input: '$addressDetails.savedAddresses',
                as: 'addressDetails',
                cond: { $eq: ['$$addressDetails._id', '$address'] }
              }
            }
          },
          potentialProfessionals: { $last: "$potentialProfessionals" },
          scheduledTimeOfService: { $last: "$scheduledTimeOfService" },
          products: { $push: { $mergeObjects: ["$products", "$productDetails"] } },
          potentialProfessionalDetails: { $push: "$potentialProfessionalDetails" },
          // addOns: { $last: "$addOns"}
          addons: { $push: { $mergeObjects: ["$addOns", "$addonDetails"] } },
        },
      }
    ]);
    return orders;
  } catch (error) {
    throw error;
  }
};

orderSchema.statics.getOrderDetailsByUserId = async function (userId) {
  try {
    const orders = await this.aggregate([
      { $match: { userId: userId } },
      { $match: { status: { $ne: "pending" } } },
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "assignedProfessionalId",
      //     foreignField: "_id",
      //     as: "professionalDetails",
      //   },
      // },
      {
        $lookup: {
          from: "users",
          localField: "assignedProfessionalId",
          foreignField: "_id",
          as: "assignedDetails",
        },
      },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "users",
          localField: "address",
          foreignField: "savedAddresses._id",
          as: "addressDetails",
        },
      },
      {
        $unwind: {
          path: "$potentialProfessionals",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "potentialProfessionals",
          foreignField: "_id",
          as: "potentialProfessionalDetails",
        },
      },
      {
        $unwind: {
          path: "$potentialProfessionalDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      { $unwind: "$addressDetails" },
      {
        $lookup: {
          from: "jobDetails",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetails.details",
        },
      },
      { $unwind: "$productDetails" },
      {
        $unwind: {
          path: "$addOns",
          preserveNullAndEmptyArrays: true
        }
      },
      // { $unwind: "$addOns" },
      {
        $lookup: {
          from: "jobDetails",
          localField: "addOns.productId",
          foreignField: "_id",
          as: "addonDetails.details",
        },
      },
      {
        $unwind: {
          path: "$addonDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      // { $unwind: "$addonDetails" },
      // // { $unwind: "$potentialProfessionals" },
      {
        $group: {
          _id: "$_id",
          assignedDetails: { $last: "$assignedDetails" },
          status: { $last: "$status" },
          tag: { $last: "$tag" },
          userDetails: { $last: "$userDetails" },
          grandTotal: { $last: "$grandTotal" },
          subTotal: { $last: "$subTotal" },
          serviceFee: { $last: "$serviceFee" },
          vat: { $last: "$vat" },
          additionalDetails: { $last: "$additionalDetails" },
          address: {
            $last: {
              $filter: {
                input: '$addressDetails.savedAddresses',
                as: 'addressDetails',
                cond: { $eq: ['$$addressDetails._id', '$address'] }
              }
            }
          },
          potentialProfessionals: { $push: "$potentialProfessionals" },
          scheduledTimeOfService: { $last: "$scheduledTimeOfService" },
          products: { $push: { $mergeObjects: ["$products", "$productDetails"] } },
          potentialProfessionalDetails: { $push: "$potentialProfessionalDetails" },
          addons: { $push: { $mergeObjects: ["$addOns", "$addonDetails"] } },
        },
      }
    ]);
    return orders;
  } catch (error) {
    throw error;
  }
};

orderSchema.statics.getOrderDetailsByProfessionalId = async function (
  professionalId
) {
  try {
    // orderIds = orderIds.map((a) => mongoose.Types.ObjectId(a));
    const orders = await this.aggregate([
      { $match: { assignedProfessionalId: professionalId } },
      { $match: { status: { $ne: "pending" } } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      // {
      //   $lookup: {
      //     from: "jobDetails",
      //     localField: "_id",
      //     foreignField: "_id",
      //     as: "professionalDetails",
      //   },
      // },
    ]);
    return orders;
  } catch (error) {
    throw error;
  }
};
export default mongoose.model("Order", orderSchema);

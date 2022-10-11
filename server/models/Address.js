import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const addressSchema = new mongoose.Schema({
  _id: false,
  street: String,
  locality: String,
  city: String,
  state: String,
  country: String,
  pincode: Number,
  lat: String,
  long: String,
});

export default addressSchema;



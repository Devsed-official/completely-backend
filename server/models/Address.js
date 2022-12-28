import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const addressSchema = new mongoose.Schema({
  street: String,
  locality: String,
  city: String,
  state: String,
  country: String,
  pincode: Number,
  lat: Number,
  lng: Number,
  placeId: String,
  formattedAddress: String,
  tag: String
});

export default addressSchema;

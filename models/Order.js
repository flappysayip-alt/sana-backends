const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  name: String,
  house: String,
  area: String,
  city: String,
  pin: String
});

const OrderSchema = new mongoose.Schema({
  service: String,
  userName: String,
  userPhone: String,

  measurements: { type: Object, default: {} },

  address: { type: AddressSchema, default: {} },

  designPhoto: String,

  status: { type: String, default: "pending" },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);

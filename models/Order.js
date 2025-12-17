const mongoose = require("mongoose");

/* Address sub-schema */
const AddressSchema = new mongoose.Schema({
  name: String,
  house: String,
  area: String,
  city: String,
  pin: String
});

/* Order schema */
const OrderSchema = new mongoose.Schema(
  {
    // 👤 User identity (VERY IMPORTANT)
    userName: {
      type: String,
      required: true
    },

    userEmail: {
      type: String,
      required: true,
      index: true
    },

    userPhone: {
      type: String,
      required: true
    },

    // ✂️ Service
    service: {
      type: String,
      required: true
    },

    // 📏 Measurements
    measurements: {
      type: Object,
      default: {}
    },

    // 🏠 Address
    address: {
      type: AddressSchema,
      default: {}
    },

    // 🖼️ Uploaded photos
    designURL: {
      type: String,
      default: ""
    },

    measureURL: {
      type: String,
      default: ""
    },

    // ⭐ Review tracking
    hasReview: {
      type: Boolean,
      default: false
    },

    // 📦 Order status
    status: {
      type: String,
      default: "pending"
    }
  },
  {
    timestamps: true, // createdAt + updatedAt
    collection: "orders"
  }
);

module.exports = mongoose.model("Order", OrderSchema);

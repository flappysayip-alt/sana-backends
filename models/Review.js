const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    // ⭐ Who wrote the review
    name: {
      type: String,
      required: true
    },

    userEmail: {
      type: String,
      required: true,
      index: true
    },

    // 📦 Which order this review belongs to
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true   // ❌ prevents duplicate reviews per order
    },

    // ⭐ Rating
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    // 📝 Review text
    text: {
      type: String,
      required: true
    },

    // 🖼️ Optional photo
    photo: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true, // createdAt + updatedAt
    collection: "reviews"
  }
);

module.exports = mongoose.model("Review", reviewSchema);

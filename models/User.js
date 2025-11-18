const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  title: String,
  house: String,
  street: String,
  area: String,
  city: String,
  pincode: String,
  contactPhone: String,
  note: String,
  fullAddress: String,
  createdAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  googleId: { type: String, default: null },
  name: { type: String, default: "" },
  email: { type: String, default: "" },

  // FIXED PHONE FIELD 🔥
  phone: { 
    type: String,
    required: false,     // Google login does NOT require phone
    unique: false,       // Must NOT be unique anymore
    sparse: true         // Allows missing values
  },

  passwordHash: { type: String, default: null },
  addresses: [AddressSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);

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
  name: String,
  email: String,
  phone: { type: String, unique: true, required: false },
  passwordHash: { type: String, default: null },
  addresses: [AddressSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);

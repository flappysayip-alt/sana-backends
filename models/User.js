const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: { type: String },   // 🔥 added - needed for Google login

  name: String,
  email: String,

  phone: { type: String, unique: true, sparse: true }, 
  // ❗ NOT required now because Google users do not have phone

  passwordHash: String,

  addresses: [
    {
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
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);

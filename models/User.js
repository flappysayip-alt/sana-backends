const mongoose = require('mongoose');

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
  name: { type: String, required: true },
  email: { type: String, required: true },

  // FIX: phone no longer required
  phone: { type: String, unique: false, default: "" },

  // for Google Auth users
  googleId: { type: String, default: "" },

  passwordHash: String,
  addresses: [AddressSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);

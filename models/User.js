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
  googleId: { type: String },   // <-- ADD THIS
  name: String,
  email: { type: String },
  phone: { type: String },      // ❗ removed unique & required
  passwordHash: String,
  addresses: [AddressSchema],
  createdAt: { type: Date, default: Date.now }
});

// Allow NULL phone but avoid duplicate NULL index
UserSchema.index({ phone: 1 }, { unique: false });

module.exports = mongoose.model('User', UserSchema);

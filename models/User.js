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
  name: String,
  email: String,
  phone: { type: String, unique: true, required: true },
  passwordHash: String, // store hashed password
  addresses: [AddressSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);

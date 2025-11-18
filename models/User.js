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
  googleId: { type: String, unique: true, sparse: true },  // ⭐ added
  name: String,
  email: { type: String, unique: true, sparse: true },      // ⭐ google email unique
  phone: { type: String },                                   // ❗ removed unique + required
  passwordHash: String,
  addresses: [AddressSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);

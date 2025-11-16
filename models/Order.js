const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    service: String,
    userPhone: String,
    userName: String,

    measurements: {},

    designPhoto: String,
    address: {},

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);

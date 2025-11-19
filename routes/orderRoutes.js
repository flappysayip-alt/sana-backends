const express = require("express");
const router = express.Router();
const multer = require("multer");
const Order = require("../models/Order");

// Upload Memory Storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* ---------------------------------------------------------
   CREATE ORDER
--------------------------------------------------------- */
router.post("/create", upload.single("designPhoto"), async (req, res) => {
  try {
    const { service, userName, userPhone, measurements } = req.body;

    const parsedMeasurements =
      typeof measurements === "string"
        ? JSON.parse(measurements)
        : measurements;

    const order = await Order.create({
      service,
      userName,
      userPhone,
      measurements: parsedMeasurements,
      designPhoto: req.file ? req.file.originalname : null, // or store base64
      status: "pending",
      createdAt: new Date()
    });

    return res.json({ success: true, orderId: order._id });
  } catch (err) {
    console.log("CREATE ERROR:", err);
    return res.json({ success: false, message: "Create failed" });
  }
});

/* ---------------------------------------------------------
   UPDATE ADDRESS
--------------------------------------------------------- */
router.patch("/:orderId/address", async (req, res) => {
  try {
    const { address } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { address },
      { new: true }
    );

    return res.json({ success: true, order });
  } catch (err) {
    console.log("ADDRESS ERROR:", err);
    return res.json({ success: false, message: "Address update failed" });
  }
});

/* ---------------------------------------------------------
   VIEW SINGLE ORDER
--------------------------------------------------------- */
router.get("/view/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order)
      return res.json({ success: false, message: "Order not found" });

    return res.json({ success: true, order });
  } catch (err) {
    console.log("VIEW ERROR:", err);
    return res.json({ success: false, message: "Fetch failed" });
  }
});

/* ---------------------------------------------------------
   GET USER ORDERS
--------------------------------------------------------- */
router.get("/user/:phone", async (req, res) => {
  try {
    const orders = await Order.find({ userPhone: req.params.phone }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.json({ success: false, message: "User orders failed" });
  }
});

/* ---------------------------------------------------------
 🔥🔥 NEW: GET ALL ORDERS FOR ADMIN PANEL 🔥🔥
--------------------------------------------------------- */
router.get("/all", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json({ success: true, orders });
  } catch (err) {
    console.log("ADMIN GET ALL ERROR:", err);
    return res.json({ success: false, message: "Failed to load orders" });
  }
});

module.exports = router;

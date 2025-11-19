const express = require("express");
const router = express.Router();
const multer = require("multer");
const Order = require("../models/Order");

// File Upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* -----------------------------------------
   CREATE ORDER
----------------------------------------- */
router.post("/create", upload.single("designPhoto"), async (req, res) => {
  try {
    const { service, userName, userPhone, measurements } = req.body;

    const order = await Order.create({
      service,
      userName,
      userPhone,
      measurements: JSON.parse(measurements),
      designPhoto: req.file ? req.file.originalname : null,
      address: {}
    });

    return res.json({ success: true, orderId: order._id });

  } catch (err) {
    console.log("ORDER CREATE ERROR:", err);
    return res.json({ success: false, message: "Order create failed" });
  }
});

/* -----------------------------------------
   FIX: GET ORDER FOR FRONTEND (NEEDS TO BE FIRST)
----------------------------------------- */
router.get("/view/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    return res.json({ success: true, order });

  } catch (err) {
    console.log("VIEW ROUTE ERROR:", err);
    return res.json({ success: false, message: "Fetch failed" });
  }
});

/* -----------------------------------------
   ADD ADDRESS
----------------------------------------- */
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
    console.log("ADDRESS UPDATE ERROR:", err);
    return res.json({ success: false, message: "Address update failed" });
  }
});

/* -----------------------------------------
   GET ALL ORDERS
----------------------------------------- */
router.get("/all", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

/* -----------------------------------------
   GET USER ORDERS
----------------------------------------- */
router.get("/user/:phone", async (req, res) => {
  const orders = await Order.find({ userPhone: req.params.phone }).sort({
    createdAt: -1,
  });
  res.json(orders);
});

/* -----------------------------------------
   MUST BE LAST: GET ORDER BY ID
----------------------------------------- */
router.get("/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    return res.json({ success: true, order });

  } catch (err) {
    console.log("ORDER BY ID ERROR:", err);
    return res.json({ success: false, message: "Fetch failed" });
  }
});

module.exports = router;

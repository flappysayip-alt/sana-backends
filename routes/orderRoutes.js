const express = require("express");
const router = express.Router();
const multer = require("multer");
const Order = require("../models/Order");

// Upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* ------------------------------
   CREATE ORDER (called from dashboard)
------------------------------ */
router.post("/create", upload.single("designPhoto"), async (req, res) => {
  try {
    const { service, userName, userPhone, measurements } = req.body;

    const order = await Order.create({
      service,
      userName,
      userPhone,
      measurements: JSON.parse(measurements),
      designPhoto: req.file ? req.file.originalname : null,
      status: "pending"
    });

    return res.json({ success: true, orderId: order._id });
  } catch (err) {
    console.log("CREATE ERROR:", err);
    return res.json({ success: false, message: "Create failed" });
  }
});

/* ------------------------------
   ATTACH ADDRESS
------------------------------ */
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

/* ------------------------------
   VIEW ORDER BY ID
------------------------------ */
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

/* ------------------------------
   USER ORDERS
------------------------------ */
router.get("/user/:phone", async (req, res) => {
  const orders = await Order.find({ userPhone: req.params.phone }).sort({ createdAt: -1 });
  res.json(orders);
});

module.exports = router;

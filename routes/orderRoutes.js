const express = require("express");
const router = express.Router();
const multer = require("multer");
const Order = require("../models/Order");

// File Upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* -----------------------------------------
   CREATE ORDER  (STEP 1)
----------------------------------------- */
router.post("/create", upload.single("designPhoto"), async (req, res) => {
  try {
    const { service, userName, userPhone, measurements } = req.body;

    const order = await Order.create({
      service,
      userName,
      userPhone,
      measurements: JSON.parse(measurements),
      designPhoto: req.file ? req.file.originalname : null
    });

    res.json({
      success: true,
      orderId: order._id
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Order create failed" });
  }
});

/* -----------------------------------------
   UPDATE ADDRESS  (STEP 2)
----------------------------------------- */
router.patch("/:orderId/address", async (req, res) => {
  try {
    const { address } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { address },
      { new: true }
    );

    res.json({ success: true, order });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Address update failed" });
  }
});

/* -----------------------------------------
   FIXED: GET ORDER BY ID  (/view/:id)
----------------------------------------- */
router.get("/view/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, order });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Fetch failed" });
  }
});

/* -----------------------------------------
   ADMIN – ALL ORDERS
----------------------------------------- */
router.get("/all", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

/* -----------------------------------------
   USER ORDERS
----------------------------------------- */
router.get("/user/:phone", async (req, res) => {
  const orders = await Order.find({ userPhone: req.params.phone }).sort({
    createdAt: -1
  });
  res.json(orders);
});

module.exports = router;

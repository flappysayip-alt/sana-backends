const express = require("express");
const router = express.Router();
const multer = require("multer");
const Order = require("../models/Order");

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
      address: null
    });

    return res.json({ success: true, orderId: order._id });
  } catch (err) {
    console.log("CREATE ERROR:", err);
    return res.json({ success: false, message: "Order create failed" });
  }
});

/* -----------------------------------------
   GET ALL ORDERS (Admin)
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
    createdAt: -1
  });
  res.json(orders);
});

/* -----------------------------------------
   GET ORDER BY ID  (THIS WAS FAILING)
----------------------------------------- */
router.get("/view/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }
    return res.json({ success: true, order });
  } catch (err) {
    console.log("FETCH ERROR:", err);
    return res.json({ success: false, message: "Fetch failed" });
  }
});

/* -----------------------------------------
   ADD ADDRESS TO ORDER
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
    console.log("ADDRESS ERROR:", err);
    return res.json({ success: false, message: "Address update failed" });
  }
});

module.exports = router;

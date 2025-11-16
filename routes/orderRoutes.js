const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const multer = require("multer");

// ----------------- MULTER UPLOAD SETTINGS -----------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

// ----------------- CREATE ORDER -----------------
router.post("/create", upload.single("designPhoto"), async (req, res) => {
  try {
    const { service, userPhone, userName } = req.body;

    const measurements = JSON.parse(req.body.measurements || "{}");
    const address = JSON.parse(req.body.address || "{}");

    const fileName = req.file ? req.file.filename : null;

    const order = new Order({
      service,
      userPhone,
      userName,
      measurements,
      address,
      designPhoto: fileName
    });

    const savedOrder = await order.save();

    res.json({
      success: true,
      orderId: savedOrder._id,
      order: savedOrder
    });

  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------- UPDATE ADDRESS -----------------
router.patch("/:id/address", async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { address: req.body.address },
      { new: true }
    );

    res.json({ success: true, order: updated });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ----------------- GET ALL ORDERS -----------------
router.get("/all", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// ----------------- PDF (placeholder) -----------------
router.get("/invoice/:id", async (req, res) => {
  res.send("PDF coming soon");
});

module.exports = router;

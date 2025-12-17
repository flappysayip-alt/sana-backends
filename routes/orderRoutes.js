const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

/* CREATE ORDER */
router.post("/", async (req, res) => {
  try {
    const {
      service,
      userName,
      userEmail,
      userPhone,
      measurements,
      address,
      designURL,
      measureURL
    } = req.body;

    if (!service || !userEmail || !userPhone) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const order = await Order.create({
      service,
      userName,
      userEmail,
      userPhone,
      measurements,
      address,
      designURL,
      measureURL,
      hasReview: false,
      status: "pending"
    });

    res.json({ success: true, order });
  } catch (err) {
    console.error("ORDER CREATE ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* GET USER ORDERS */
router.get("/", async (req, res) => {
  try {
    const { userEmail } = req.query;

    if (!userEmail) return res.json([]);

    const orders = await Order.find({ userEmail })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("GET ORDERS ERROR:", err);
    res.json([]);
  }
});

/* MARK ORDER AS REVIEWED */
router.patch("/:orderId/reviewed", async (req, res) => {
  await Order.findByIdAndUpdate(req.params.orderId, { hasReview: true });
  res.json({ success: true });
});

module.exports = router;

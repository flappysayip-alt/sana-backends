const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Order = require("../models/Order");

/* =========================
   POST REVIEW (NEW)
   ========================= */
router.post("/", async (req, res) => {
  try {
    const { rating, text, orderId, userEmail, name, photo } = req.body;

    if (!rating || !text || !orderId || !userEmail) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // ❌ Prevent duplicate review for same order
    const existing = await Review.findOne({ orderId });
    if (existing) {
      return res.status(400).json({ message: "Review already exists" });
    }

    // ✅ Save review
    const review = new Review({
      name,
      rating,
      text,
      orderId,
      userEmail,
      photo
    });

    await review.save();

    // ✅ Mark order as reviewed
    await Order.findByIdAndUpdate(orderId, { hasReview: true });

    res.json({ success: true });
  } catch (err) {
    console.error("Review save error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   GET ALL REVIEWS
   ========================= */
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   UPDATE REVIEW (OWNER ONLY)
   ========================= */
router.put("/:id", async (req, res) => {
  try {
    const { text, rating, userEmail } = req.body;

    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Not found" });

    if (review.userEmail !== userEmail) {
      return res.status(403).json({ message: "Not allowed" });
    }

    review.text = text;
    review.rating = rating;
    await review.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   DELETE REVIEW (OWNER ONLY)
   ========================= */
router.delete("/:id", async (req, res) => {
  try {
    const { userEmail } = req.query;

    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Not found" });

    if (review.userEmail !== userEmail) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Review.findByIdAndDelete(req.params.id);

    // ❌ Unmark order review
    await Order.findByIdAndUpdate(review.orderId, { hasReview: false });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

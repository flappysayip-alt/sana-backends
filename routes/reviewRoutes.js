const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// GET all reviews (public)
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

// POST new review
router.post("/", async (req, res) => {
  try {
    const { name, rating, text } = req.body;

    const review = new Review({ name, rating, text });
    await review.save();

    res.json({ success: true, message: "Review added" });
  } catch (err) {
    res.status(500).json({ message: "Failed to save review" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

/* POST review */
router.post("/", async (req, res) => {
  try {
    const { rating, text } = req.body;

    if (!rating || !text) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const review = new Review({ rating, text });
    await review.save();

    res.json({ success: true });
  } catch (err) {
    console.error("Review save error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* GET reviews */
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error("Review fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

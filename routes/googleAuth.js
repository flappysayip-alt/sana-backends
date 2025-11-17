const express = require("express");
const passport = require("passport");
const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL;

// Step 1: Send user to Google Login
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${FRONTEND_URL}/google-fail.html` }),
  (req, res) => {
    // SUCCESS → redirect back to frontend
    res.redirect(`${FRONTEND_URL}/google-success.html`);
  }
);

module.exports = router;

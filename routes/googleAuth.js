const express = require("express");
const passport = require("passport");

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL;

// Google Login
router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

// Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_URL}/google-fail.html`
  }),
  (req, res) => {
    res.redirect(`${FRONTEND_URL}/google-success.html`);
  }
);

module.exports = router;

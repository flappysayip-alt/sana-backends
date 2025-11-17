const express = require("express");
const passport = require("passport");
const router = express.Router();

// 👉 Start Google Login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 👉 Google Redirect URL
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.FRONTEND_URL + "/user-login.html",
  }),
  (req, res) => {
    const user = req.user;

    const redirectURL =
      `${process.env.FRONTEND_URL}/google-success.html` +
      `?name=${encodeURIComponent(user.name)}` +
      `&email=${encodeURIComponent(user.email || "")}` +
      `&id=${user._id}`;

    res.redirect(redirectURL);
  }
);

module.exports = router;

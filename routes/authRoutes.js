const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// Start Google Login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback after Google Login
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost/user-login.html",
  }),
  async (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      { id: user._id, email: user.email },
      "GOOGLE_SECRET",
      { expiresIn: "7d" }
    );

    // Admin detection
    if (user.email === ADMIN_EMAIL) {
      return res.redirect(
        `http://localhost/admin-dashboard.html?token=${token}&admin=true`
      );
    }

    // Normal user redirect
    res.redirect(
      `http://localhost/user-dashboard.html?token=${token}&name=${user.name}&email=${user.email}`
    );
  }
);

module.exports = router;

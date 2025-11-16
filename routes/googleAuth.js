const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login-failed" }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET || "tailor123",
      { expiresIn: "7d" }
    );

    return res.redirect(
      `${process.env.FRONTEND_URL}/user-dashboard.html?token=${token}&name=${encodeURIComponent(user.name)}`
    );
  }
);

module.exports = router;

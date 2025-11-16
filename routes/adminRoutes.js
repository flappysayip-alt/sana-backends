const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  if (
    req.body.email === process.env.ADMIN_EMAIL &&
    req.body.password === process.env.ADMIN_PASSWORD
  ) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

module.exports = router;

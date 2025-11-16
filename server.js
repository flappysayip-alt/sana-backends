// ----------------------
// SANA TAILOR BACKEND
// GOOGLE LOGIN + OTP + ORDERS
// ----------------------

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");

const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const googleAuthRoutes = require("./routes/googleAuth");

require("./config/passport"); // GOOGLE STRATEGY

const app = express();

// ---------- MIDDLEWARE ----------
app.use(cors({
  origin: [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "https://sanatai.netlify.app"
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- SESSION FOR GOOGLE LOGIN ----------
app.use(
  session({
    secret: "sana_tailor_secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ---------- DATABASE ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Mongo Error:", err));

// ---------- ROUTES ----------
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Sana Tailor Backend Running" });
});

app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", googleAuthRoutes);

// ---------- SERVER ----------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend Live at PORT ${PORT}`);
});

// =============================
//   SANA TAILOR BACKEND SERVER
// =============================

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

// Routes
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// -----------------------------
// Middleware
// -----------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (Allow All)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  })
);

// Static folder for uploaded design photos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -----------------------------
// API ROUTES
// -----------------------------
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);

// -----------------------------
// HEALTH CHECK (Required for Render)
// -----------------------------
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend running successfully 🎉",
    time: new Date().toISOString(),
  });
});

// -----------------------------
// DATABASE CONNECTION
// -----------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// -----------------------------
// START SERVER
// -----------------------------
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

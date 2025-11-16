// -------------------- IMPORTS --------------------
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");

const app = express();

// -------------------- MIDDLEWARE --------------------
app.use(cors());
app.use(express.json());

// Static folder for uploaded photos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -------------------- ROUTES --------------------
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);

// -------------------- MONGO CONNECTION --------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

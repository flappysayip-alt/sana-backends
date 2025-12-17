const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const multer = require("multer");               // ✅ ADDED
const path = require("path");                   // ✅ ADDED
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const googleAuthRoutes = require("./routes/googleAuth");
const pdfRoutes = require("./routes/pdfRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const User = require("./models/User");

const app = express();

// ---------------- CORS ----------------
app.use(express.json());

app.use(cors({
  origin: [
    "null",
    "*",
    process.env.FRONTEND_URL,
    "http://localhost:3000",
    "http://localhost:5500",
    "https://sanafashion.netlify.app"
  ],
  methods: ["GET","POST","PATCH","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ---------------- SESSION ----------------
app.use(session({
  secret: process.env.JWT_SECRET || "tailor123",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// ---------------- PASSPORT ----------------
app.use(passport.initialize());
app.use(passport.session());

// GOOGLE STRATEGY
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value || null,
          phone: null
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// ---------------- FILE UPLOAD (NEW) ----------------

// Serve uploaded images publicly
app.use("/uploads", express.static("uploads"));

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Upload API
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

   const fileUrl = `https://${req.headers.host}/uploads/${req.file.filename}`;

  res.json({
    success: true,
    url: fileUrl
  });
});

// ---------------- ROUTES ----------------
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/orders", pdfRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", googleAuthRoutes);
app.use("/api/reviews", reviewRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", time: new Date() });
});

// ---------------- DB ----------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.log("MongoDB Error:", err));

// ---------------- SERVER ----------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

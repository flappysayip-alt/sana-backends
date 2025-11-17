const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const googleAuthRoutes = require("./routes/googleAuth");

const User = require("./models/User");

const app = express();

// ---------------- CORS ----------------
app.use(express.json());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    "http://localhost:3000",
    "http://localhost:5500",
    "https://sanatai.netlify.app"
  ],
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

// ---------------- ROUTES ----------------
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", googleAuthRoutes);

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

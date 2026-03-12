import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";

import albumRoutes from "./routes/albums.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import { errorHandler } from "./middleware/errorHandler.js";
import initializePassport from "./config/passport.js";

const app = express();
const PORT = 3000;

// JSON parsing
app.use(express.json());

// Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret123",
    resave: false,
    saveUninitialized: false
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());
initializePassport();

// Routes
app.use("/albums", albumRoutes);
app.use("/api", authRoutes);
app.use("/users", userRoutes);

// Error handler
app.use(errorHandler);

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err.message));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
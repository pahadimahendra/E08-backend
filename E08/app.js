import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";

import albumRoutes from "./routes/albums.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import { errorHandler } from "./middleware/errorHandler.js";
import initializePassport from "./config/passport.js";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env"
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret123",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
initializePassport();

app.use("/api/albums", albumRoutes);
app.use("/api", authRoutes);
app.use("/users", userRoutes);

app.use(errorHandler);

const mongoURI =
  process.env.NODE_ENV === "test"
    ? process.env.MONGO_URI_TEST
    : process.env.MONGO_URI;

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err.message));

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

export default app;
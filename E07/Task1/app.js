import express from "express";
import albumRoutes from "./routes/albums.js";
import authRoutes from "./routes/auth.js";

import "dotenv/config";
import mongoose from "mongoose";

import passport from "passport";
import session from "express-session";

import "./config/passport.js";

import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(
  session({
    secret: "secret123",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.url}`);
  next();
};

app.use(requestLogger);

app.use(express.static("public"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err.message));

app.use("/albums", albumRoutes);
app.use("/api", authRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
import express from "express";
import albumRoutes from "./routes/albums.js";
import authRoutes from "./routes/auth.js";

import "dotenv/config";
import mongoose from "mongoose";

import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = 3000;

// Parse JSON
app.use(express.json());

// Request logger
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.url}`);
  next();
};

app.use(requestLogger);

// Serve frontend
app.use(express.static("public"));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err.message));

// Routes
app.use("/albums", albumRoutes);
app.use("/api", authRoutes);

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
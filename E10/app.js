import express from "express";
import pool from "./db.js";
import userRoutes from "./routes/users.js";
import vehicleRoutes from "./routes/vehicles.js";
import maintenanceRoutes from "./routes/maintenance.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      time: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.use("/users", userRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/maintenance", maintenanceRoutes);

console.log("Models synchronized");

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


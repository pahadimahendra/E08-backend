import express from "express";
import {
  createMaintenanceRecord,
  assignVehicleToMaintenance,
  getVehicleMaintenanceHistory
} from "../controllers/maintenance.js";

const router = express.Router();

router.post("/", createMaintenanceRecord);
router.post("/:maintenanceId/vehicles/:vehicleId", assignVehicleToMaintenance);
router.get("/vehicles/:vehicleId/history", getVehicleMaintenanceHistory);

export default router;
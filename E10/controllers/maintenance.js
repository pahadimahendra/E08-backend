import pool from "../db.js";

// CREATE MAINTENANCE RECORD
export const createMaintenanceRecord = async (req, res) => {
  try {
    const { service_type, description, cost, service_date } = req.body;

    if (!service_type || !service_date) {
      return res.status(400).json({
        success: false,
        error: "service_type and service_date are required"
      });
    }

    const result = await pool.query(
      `INSERT INTO maintenance_records (service_type, description, cost, service_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [service_type, description || null, cost || null, service_date]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ASSIGN VEHICLE TO MAINTENANCE
export const assignVehicleToMaintenance = async (req, res) => {
  try {
    const { maintenanceId, vehicleId } = req.params;
    const { mechanic_name, hours_spent, notes } = req.body;

    if (!mechanic_name) {
      return res.status(400).json({
        success: false,
        error: "mechanic_name is required"
      });
    }

    await pool.query(
      `INSERT INTO vehicle_maintenance_records
       (vehicle_id, maintenance_record_id, mechanic_name, hours_spent, notes)
       VALUES ($1, $2, $3, $4, $5)`,
      [vehicleId, maintenanceId, mechanic_name, hours_spent || null, notes || null]
    );

    res.status(201).json({
      success: true,
      msg: "Vehicle assigned to maintenance record successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// GET VEHICLE MAINTENANCE HISTORY
export const getVehicleMaintenanceHistory = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const vehicleResult = await pool.query(
      `SELECT * FROM vehicles WHERE id = $1`,
      [vehicleId]
    );

    if (vehicleResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Vehicle not found"
      });
    }

    const historyResult = await pool.query(
      `SELECT
         mr.id,
         mr.service_type,
         mr.description,
         mr.cost,
         mr.service_date,
         vmr.mechanic_name,
         vmr.hours_spent,
         vmr.notes
       FROM vehicle_maintenance_records vmr
       JOIN maintenance_records mr
         ON vmr.maintenance_record_id = mr.id
       WHERE vmr.vehicle_id = $1
       ORDER BY mr.id ASC`,
      [vehicleId]
    );

    res.status(200).json({
      success: true,
      data: {
        vehicle: vehicleResult.rows[0],
        maintenance_history: historyResult.rows
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
import pool from "../db.js";

// CREATE VEHICLE
export const createVehicle = async (req, res) => {
  try {
    const { brand, model, year, userId } = req.body;

    if (!brand || !model || !year || !userId) {
      return res.status(400).json({
        success: false,
        error: "brand, model, year and userId are required"
      });
    }

    const result = await pool.query(
      `INSERT INTO vehicles (brand, model, year, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [brand, model, year, userId]
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

// GET ALL VEHICLES
export const getVehicles = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT vehicles.id, vehicles.brand, vehicles.model, vehicles.year, vehicles.user_id,
              users.username, users.name
       FROM vehicles
       JOIN users ON vehicles.user_id = users.id
       ORDER BY vehicles.id ASC`
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
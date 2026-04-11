import pool from "../db.js";

// CREATE USER
export const createUser = async (req, res) => {
  try {
    const { username, name } = req.body;

    if (!username || !name) {
      return res.status(400).json({
        success: false,
        error: "username and name are required"
      });
    }

    const result = await pool.query(
      "INSERT INTO users (username, name) VALUES ($1, $2) RETURNING *",
      [username, name]
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

// GET USERS
export const getUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id ASC");

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
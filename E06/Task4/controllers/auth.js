import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppError from "../errors/AppError.js";

// REGISTER USER
export const register = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    // Check required fields
    if (!name || !email || !password || !passwordConfirm) {
      throw new AppError("All fields are required", 400);
    }

    // Check password confirmation
    if (password !== passwordConfirm) {
      throw new AppError("Passwords do not match", 400);
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new AppError("Email already exists", 400);
    }

    const user = await User.create({
      name,
      email,
      password
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    next(error);
  }
};

// LOGIN USER
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    next(error);
  }
};
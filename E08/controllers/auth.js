import User from "../models/User.js";
import AppError from "../errors/AppError.js";
import passport from "passport";

// REGISTER USER (with optional role for admin)
export const register = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm, role } = req.body;

    if (!name || !email || !password || !passwordConfirm) {
      throw new AppError("All fields are required", 400);
    }

    if (password !== passwordConfirm) {
      throw new AppError("Passwords do not match", 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new AppError("Email already exists", 400);

    const user = await User.create({
      name,
      email,
      password,
      role: role || "user"
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    next(err);
  }
};

// LOGIN USER
export const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info.message });

    req.login(user, (err) => {
      if (err) return next(err);

      res.json({
        message: "Login successful",
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    });
  })(req, res, next);
};

// LOGOUT USER
export const logout = (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out" });
  });
};
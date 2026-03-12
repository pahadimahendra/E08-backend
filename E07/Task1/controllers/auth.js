import User from "../models/User.js";
import passport from "passport";

export const register = async (req, res, next) => {

  try {

    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password
    });

    res.status(201).json({
      message: "User registered",
      user
    });

  } catch (error) {
    next(error);
  }

};

export const login = (req, res, next) => {

  passport.authenticate("local", (err, user, info) => {

    if (err) return next(err);

    if (!user) {
      return res.status(401).json({ error: info.message });
    }

    req.login(user, (err) => {

      if (err) return next(err);

      res.json({
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        }
      });

    });

  })(req, res, next);

};

export const logout = (req, res) => {

  req.logout(() => {
    res.json({ message: "Logged out" });
  });

};
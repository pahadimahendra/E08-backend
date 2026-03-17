import User from "../models/User.js";

// GET all users (admin only)
export async function getAllUsers(req, res) {
  const users = await User.find().select("-password");
  res.json(users);
}

// DELETE user (admin only)
export async function deleteUser(req, res) {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ message: "User deleted" });
}
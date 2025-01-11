const User = require('../models/user.model');
const { AppError } = require('../middleware/error.middleware');

// Create new User
exports.createUser = async (req, res) => {
  const user = new User(req.body);
  const savedUser = await user.save();
  res.status(201).json(savedUser);
};

// Get all Users
exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
};

// Get User by ID
exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.status(200).json(user);
};

// Update User
exports.updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.status(200).json(user);
};

// Delete User
exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.status(200).json({ message: 'User deleted successfully' });
}; 
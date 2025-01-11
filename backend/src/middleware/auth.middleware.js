const jwt = require('jsonwebtoken');
const { AppError } = require('./error.middleware');
const Admin = require('../models/admin.model');

exports.protect = async (req, res, next) => {
  try {
    // 1) Get token
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if admin still exists
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return next(new AppError('The admin belonging to this token no longer exists.', 401));
    }

    // Grant access to protected route
    req.admin = admin;
    next();
  } catch (error) {
    next(new AppError('Invalid token. Please log in again.', 401));
  }
}; 
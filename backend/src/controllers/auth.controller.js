const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');
const { AppError } = require('../middleware/error.middleware');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // Check if admin exists && password is correct
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // Send token
    const token = signToken(admin._id);
    res.status(200).json({
      status: 'success',
      token,
      data: {
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
}; 
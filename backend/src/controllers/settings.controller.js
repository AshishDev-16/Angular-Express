const Admin = require('../models/admin.model');
const { AppError } = require('../middleware/error.middleware');
const bcrypt = require('bcryptjs');

exports.getSettings = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('settings');
    res.status(200).json({
      status: 'success',
      data: admin.settings
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username) {
      return next(new AppError('Username is required', 400));
    }

    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      { username },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      status: 'success',
      data: admin
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return next(new AppError('Both current and new password are required', 400));
    }

    const admin = await Admin.findById(req.admin.id);
    
    if (!(await admin.comparePassword(currentPassword))) {
      return next(new AppError('Current password is incorrect', 401));
    }

    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const allowedSettings = ['theme', 'language', 'notifications', 'layoutDensity'];
    const updateData = {};

    Object.keys(req.body).forEach(key => {
      if (allowedSettings.includes(key)) {
        updateData[`settings.${key}`] = req.body[key];
      }
    });

    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      status: 'success',
      data: admin.settings
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleTwoFactor = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    admin.settings.twoFactorEnabled = !admin.settings.twoFactorEnabled;
    await admin.save();

    res.status(200).json({
      status: 'success',
      data: {
        twoFactorEnabled: admin.settings.twoFactorEnabled
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getActiveSessions = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('activeSessions');
    res.status(200).json({
      status: 'success',
      data: admin.activeSessions
    });
  } catch (error) {
    next(error);
  }
};

exports.terminateSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    
    await Admin.findByIdAndUpdate(req.admin.id, {
      $pull: { activeSessions: { _id: sessionId } }
    });

    res.status(200).json({
      status: 'success',
      message: 'Session terminated successfully'
    });
  } catch (error) {
    next(error);
  }
}; 
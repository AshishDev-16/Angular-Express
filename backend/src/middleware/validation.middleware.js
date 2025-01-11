const { AppError } = require('./error.middleware');

const validateUserInput = (req, res, next) => {
  const { name, email, phone } = req.body;

  // Validate name
  if (!name || name.trim().length < 2) {
    return next(new AppError('Name must be at least 2 characters long', 400));
  }

  // Validate email
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email)) {
    return next(new AppError('Please provide a valid email address', 400));
  }

  // Validate phone
  const phoneRegex = /^\d{10}$/;
  if (!phone || !phoneRegex.test(phone)) {
    return next(new AppError('Please provide a valid 10-digit phone number', 400));
  }

  next();
};

module.exports = {
  validateUserInput
}; 
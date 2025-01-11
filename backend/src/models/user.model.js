const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: {
      type: String,
      match: [/^\d{6}$/, 'Please enter a valid 6-digit ZIP code']
    },
    country: {
      type: String,
      default: 'United States'
    }
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    default: 'prefer-not-to-say'
  },
  department: {
    type: String,
    enum: ['IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations', 'Management']
  },
  position: String,
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },
  profileImage: String,
  socialLinks: {
    linkedin: {
      type: String,
      match: [/^https?:\/\/.*$/, 'Please enter a valid URL']
    },
    twitter: {
      type: String,
      match: [/^https?:\/\/.*$/, 'Please enter a valid URL']
    },
    facebook: {
      type: String,
      match: [/^https?:\/\/.*$/, 'Please enter a valid URL']
    }
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User; 
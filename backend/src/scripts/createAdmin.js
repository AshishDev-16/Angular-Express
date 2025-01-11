const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/admin.model');

dotenv.config({ path: '.env' });

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      const adminData = {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'super-admin'
      };

      const admin = await Admin.create(adminData);
      console.log('Admin created successfully:', admin);
    } catch (error) {
      console.error('Error creating admin:', error);
    }
    mongoose.connection.close();
  })
  .catch(error => {
    console.error('Database connection error:', error);
  }); 
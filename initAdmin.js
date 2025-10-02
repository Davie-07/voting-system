const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const { hashPassword } = require('./utils/authUtils');
require('dotenv').config();

const initAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ systemId: '01759905' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await hashPassword('KandaraTechnicalAdminPass12.34');

    // Create admin user
    const admin = new Admin({
      systemId: '01759905',
      password: hashedPassword
    });

    await admin.save();

    console.log('Admin user created successfully!');
    console.log('System ID: 01759905');
    console.log('Password: KandaraTechnicalAdminPass12.34');
    console.log('Please change the password after first login for security.');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

initAdmin();
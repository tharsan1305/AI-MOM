const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // TODO: replace with real SMTP domain before production
    const adminEmail = 'admin@minutecraft.ai';
    const adminPassword = 'Admin@123';

    // Check if superadmin already exists
    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log(`Admin user ${adminEmail} already exists.`);
      if (admin.role !== 'superadmin') {
        admin.role = 'superadmin';
        await admin.save();
        console.log('Updated existing user to superadmin role.');
      }
    } else {
      // Create new superadmin
      admin = await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'superadmin',
        status: 'active'
      });
      console.log('Super admin created successfully!');
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();

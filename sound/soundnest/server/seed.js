

const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/spotify_clone';

const demoUsers = [
  { name: 'Admin User',   email: 'admin@demo.com',   password: 'admin123',   role: 'admin'   },
  { name: 'Demo Artist',  email: 'artist@demo.com',  password: 'artist123',  role: 'artist'  },
  { name: 'Premium User', email: 'premium@demo.com', password: 'premium123', role: 'premium' },
  { name: 'Normal User',  email: 'user@demo.com',    password: 'user1234',   role: 'user'    },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  for (const u of demoUsers) {
    const exists = await User.findOne({ email: u.email });
    if (!exists) {
      await User.create(u);
      console.log(`Created: ${u.email} (${u.role})`);
    } else {
      console.log(`Skipped: ${u.email} already exists`);
    }
  }

  console.log('\nDemo accounts ready:');
  demoUsers.forEach(u => console.log(`  ${u.role.padEnd(10)} ${u.email} / ${u.password}`));
  await mongoose.disconnect();
}

seed().catch(console.error);

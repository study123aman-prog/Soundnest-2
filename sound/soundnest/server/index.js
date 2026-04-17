
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/spotify_clone';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'spotify_clone_secret_key_2024',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URI }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  }
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//  Apply ban/suspension check to all API routes
const { checkBanStatus } = require('./middleware/auth');
app.use('/api', checkBanStatus);

//Routes
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/songs',     require('./routes/songs'));
app.use('/api/users',     require('./routes/users'));
app.use('/api/playlists', require('./routes/playlists'));
app.use('/api/comments',  require('./routes/comments')); // NEW

// Default Route 
app.get('/', (req, res) => {
  res.json({ message: 'Spotify Clone API is running 🎵' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

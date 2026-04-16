const mongoose = require('mongoose');
const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Song title is required'],
    trim: true,
  },
  artist: {
    type: String,
    required: [true, 'Artist name is required'],
    trim: true,
  },
  album: {
    type: String,
    default: 'Unknown Album',
  },
  genre: {
    type: String,
    default: 'Pop',
  },
  duration: {
    type: String,
    default: '0:00',
  },
  fileUrl: {
    type: String,
    required: true,
  },
  coverUrl: {
    type: String,
    default: '/uploads/default-cover.png',
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Song', SongSchema);

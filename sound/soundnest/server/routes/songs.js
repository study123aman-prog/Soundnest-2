// =============================================
// server/routes/songs.js - Song Routes
// MODIFIED: added PATCH /:id for editing song details
// =============================================

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Song = require('../models/Song');
const { requireLogin, requireRole } = require('../middleware/auth');

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/songs';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files allowed!'), false);
    }
  }
});

// GET /api/songs - Get all songs (public)
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching songs' });
  }
});

// GET /api/songs/:id - Get single song
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json(song);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching song' });
  }
});

// POST /api/songs - Upload a new song (Admin or Artist only)
router.post('/', requireRole('admin', 'artist'), upload.single('file'), async (req, res) => {
  try {
    const { title, artist, album, genre, duration } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Audio file is required' });

    const song = await Song.create({
      title,
      artist,
      album: album || 'Unknown Album',
      genre: genre || 'Pop',
      duration: duration || '0:00',
      fileUrl: `/uploads/songs/${req.file.filename}`,
      uploadedBy: req.session.user.id,
    });

    res.status(201).json({ message: 'Song uploaded successfully', song });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Error uploading song' });
  }
});

// NEW: PATCH /api/songs/:id - Edit song details (Admin or the Artist who uploaded it)
router.patch('/:id', requireRole('admin', 'artist'), async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });

    // Artists can only edit their own songs; admins can edit any
    if (
      req.session.user.role === 'artist' &&
      song.uploadedBy?.toString() !== req.session.user.id
    ) {
      return res.status(403).json({ message: 'You can only edit your own songs' });
    }

    const { title, artist, album, genre } = req.body;

    // Only update fields that were sent
    if (title)  song.title  = title;
    if (artist) song.artist = artist;
    if (album)  song.album  = album;
    if (genre)  song.genre  = genre;

    await song.save();
    res.json({ message: 'Song updated successfully', song });
  } catch (err) {
    console.error('Edit error:', err);
    res.status(500).json({ message: 'Error updating song' });
  }
});

// DELETE /api/songs/:id - Delete a song (Admin only)
router.delete('/:id', requireRole('admin'), async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json({ message: 'Song deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting song' });
  }
});

// POST /api/songs/:id/like - Like a song (Premium users)
router.post('/:id/like', requireRole('premium', 'admin'), async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json({ message: 'Song liked!', likes: song.likes });
  } catch (err) {
    res.status(500).json({ message: 'Error liking song' });
  }
});

// NEW: GET /api/songs/:id/stats - Get stats for a song (Artist/Admin)
router.get('/:id/stats', requireRole('admin', 'artist'), async (req, res) => {
  try {
    const Comment = require('../models/Comment');
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });

    // Count comments and get average rating
    const comments = await Comment.find({ songId: req.params.id });
    const avgRating = comments.length > 0
      ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(1)
      : null;

    res.json({
      title: song.title,
      artist: song.artist,
      likes: song.likes,
      totalComments: comments.length,
      avgRating,
      uploadedAt: song.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const { requireLogin, requireRole } = require('../middleware/auth');

router.get('/', requireLogin, async (req, res) => {
  try {
    const playlists = await Playlist.find({ userId: req.session.user.id })
      .populate('songs'); // Fill in song details
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching playlists' });
  }
});

// Create a playlist (Premium users)
router.post('/', requireRole('premium', 'admin'), async (req, res) => {
  try {
    const { name } = req.body;
    const playlist = await Playlist.create({
      name,
      userId: req.session.user.id,
      songs: [],
    });
    res.status(201).json({ message: 'Playlist created', playlist });
  } catch (err) {
    res.status(500).json({ message: 'Error creating playlist' });
  }
});

// Add song to playlist
router.post('/:id/songs', requireRole('premium', 'admin'), async (req, res) => {
  try {
    const { songId } = req.body;
    const playlist = await Playlist.findOneAndUpdate(
      { _id: req.params.id, userId: req.session.user.id },
      { $addToSet: { songs: songId } }, // $addToSet avoids duplicates
      { new: true }
    ).populate('songs');
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    res.json({ message: 'Song added', playlist });
  } catch (err) {
    res.status(500).json({ message: 'Error adding song to playlist' });
  }
});

//Delete playlist
router.delete('/:id', requireRole('premium', 'admin'), async (req, res) => {
  try {
    await Playlist.findOneAndDelete({ _id: req.params.id, userId: req.session.user.id });
    res.json({ message: 'Playlist deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting playlist' });
  }
});

module.exports = router;
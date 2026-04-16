// =============================================
// server/routes/comments.js - Comments & Ratings
// NEW FILE - add to server/routes/
// =============================================

const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { requireLogin } = require('../middleware/auth');

// GET /api/comments/:songId - Get all comments for a song (public)
router.get('/:songId', async (req, res) => {
  try {
    const comments = await Comment.find({ songId: req.params.songId })
      .sort({ createdAt: -1 }); // newest first
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

// POST /api/comments/:songId - Add a comment (logged-in users only)
router.post('/:songId', requireLogin, async (req, res) => {
  try {
    const { text, rating } = req.body;

    if (!text || !rating) {
      return res.status(400).json({ message: 'Comment text and rating are required' });
    }

    // Check if this user already commented on this song
    const existing = await Comment.findOne({
      songId: req.params.songId,
      userId: req.session.user.id,
    });

    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this song' });
    }

    const comment = await Comment.create({
      songId: req.params.songId,
      userId: req.session.user.id,
      userName: req.session.user.name,
      text,
      rating: parseInt(rating),
    });

    res.status(201).json({ message: 'Comment added!', comment });
  } catch (err) {
    console.error('Comment error:', err);
    res.status(500).json({ message: 'Error adding comment' });
  }
});

// DELETE /api/comments/:id - Delete own comment
router.delete('/:id', requireLogin, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Only the author or admin can delete
    if (comment.userId.toString() !== req.session.user.id && req.session.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting comment' });
  }
});

module.exports = router;

// =============================================
// server/models/Comment.js - Comment & Rating Schema
// NEW FILE - add to server/models/
// =============================================

const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  // Which song this comment belongs to
  songId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
    required: true,
  },
  // Who wrote this comment
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  // The comment text
  text: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true,
    maxlength: 500,
  },
  // Star rating 1-5
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Comment', CommentSchema);

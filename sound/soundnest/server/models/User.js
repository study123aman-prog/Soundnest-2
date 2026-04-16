// =============================================
// server/models/User.js - User Schema
// MODIFIED: added isBanned, suspendedUntil fields
// =============================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'artist', 'premium', 'user', 'guest'],
    default: 'user',
  },
  // NEW: permanent ban flag
  isBanned: {
    type: Boolean,
    default: false,
  },
  // NEW: temporary suspension - stores the date until they are suspended
  suspendedUntil: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// NEW: helper method to check if user is currently suspended
UserSchema.methods.isCurrentlySuspended = function () {
  if (!this.suspendedUntil) return false;
  return new Date() < new Date(this.suspendedUntil);
};

module.exports = mongoose.model('User', UserSchema);

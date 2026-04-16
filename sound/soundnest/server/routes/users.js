const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Song = require('../models/Song');
const Comment = require('../models/Comment');
const { requireRole } = require('../middleware/auth');

// GET /api/users - Get all users (Admin only)
router.get('/', requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// DELETE /api/users/:id - Delete a user (Admin only)
router.delete('/:id', requireRole('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// NEW: PATCH /api/users/:id/ban - Permanently ban a user (Admin only)
router.patch('/:id/ban', requireRole('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot ban an admin' });

    user.isBanned = true;
    user.suspendedUntil = null; // Clear any suspension if banning
    await user.save();

    res.json({ message: `${user.name} has been permanently banned.` });
  } catch (err) {
    res.status(500).json({ message: 'Error banning user' });
  }
});

// NEW: PATCH /api/users/:id/unban - Remove ban (Admin only)
router.patch('/:id/unban', requireRole('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBanned = false;
    user.suspendedUntil = null;
    await user.save();

    res.json({ message: `${user.name}'s ban has been lifted.` });
  } catch (err) {
    res.status(500).json({ message: 'Error unbanning user' });
  }
});

// NEW: PATCH /api/users/:id/suspend - Temporarily suspend (Admin only)
// Body: { days: 7 }
router.patch('/:id/suspend', requireRole('admin'), async (req, res) => {
  try {
    const { days } = req.body;
    if (!days || days < 1) return res.status(400).json({ message: 'Provide number of days (min 1)' });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot suspend an admin' });

    const until = new Date();
    until.setDate(until.getDate() + parseInt(days));
    user.suspendedUntil = until;
    user.isBanned = false;
    await user.save();

    res.json({ message: `${user.name} suspended for ${days} day(s) until ${until.toLocaleDateString()}.` });
  } catch (err) {
    res.status(500).json({ message: 'Error suspending user' });
  }
});

// NEW: GET /api/users/analytics - Admin analytics dashboard data
router.get('/analytics', requireRole('admin'), async (req, res) => {
  try {
    const [totalUsers, totalSongs, totalComments] = await Promise.all([
      User.countDocuments(),
      Song.countDocuments(),
      Comment.countDocuments(),
    ]);

    // Users by role
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Top 5 most liked songs
    const topSongs = await Song.find()
      .sort({ likes: -1 })
      .limit(5)
      .select('title artist likes genre');

    // Songs uploaded per genre
    const songsByGenre = await Song.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Recent signups (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentSignups = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    // Banned/suspended counts
    const bannedCount = await User.countDocuments({ isBanned: true });
    const suspendedCount = await User.countDocuments({
      suspendedUntil: { $gt: new Date() },
      isBanned: false
    });

    res.json({
      totalUsers,
      totalSongs,
      totalComments,
      recentSignups,
      bannedCount,
      suspendedCount,
      usersByRole,
      topSongs,
      songsByGenre,
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
});
// PATCH /api/users/upgrade-to-premium
// router.patch('/upgrade-to-premium', async (req, res) => {
  //   router.patch('/upgrade-to-premium', requireRole('user'), async (req, res) => {
  //   try {
  //     if (!req.user) return res.status(401).json({ message: 'Not logged in' });
  //     const user = await User.findById(req.user._id);
  //     if (!user) return res.status(404).json({ message: 'User not found' });
  //     if (user.role === 'premium') return res.status(400).json({ message: 'Already premium' });

  //     user.role = 'premium';
  //     await user.save();
  //     res.json({ message: 'Upgraded to premium!', user });
  //   } catch (err) {
  //     res.status(500).json({ message: 'Upgrade failed' });
  //   }
  // });
  router.patch('/upgrade-to-premium', async (req, res) => {
  try {
    if (!req.session || !req.session.user) 
      return res.status(401).json({ message: 'Not logged in' });
    
    const user = await User.findById(req.session.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'premium') return res.status(400).json({ message: 'Already premium' });

    user.role = 'premium';
    await user.save();

    req.session.user.role = 'premium'; // ← updates session so /me returns new role

    res.json({ message: 'Upgraded to premium!', user: req.session.user });
  } catch (err) {
    res.status(500).json({ message: 'Upgrade failed' });
  }
});
module.exports = router;

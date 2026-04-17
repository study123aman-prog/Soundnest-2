// =============================================
// server/middleware/auth.js - Auth Middleware


const User = require('../models/User');

// Middleware: Check if user is logged in
const requireLogin = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'Please login to continue' });
  }
};

// Middleware: Check if user has required role
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    if (!roles.includes(req.session.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

// NEW Middleware: Check ban/suspension status on each request

const checkBanStatus = async (req, res, next) => {
  if (!req.session || !req.session.user) return next(); // Not logged in, skip
  try {
    const user = await User.findById(req.session.user.id);
    if (!user) return next();

    if (user.isBanned) {
      req.session.destroy(() => {});
      return res.status(403).json({ message: 'Your account has been permanently banned.' });
    }

    if (user.suspendedUntil && new Date() < new Date(user.suspendedUntil)) {
      const until = new Date(user.suspendedUntil).toLocaleDateString();
      req.session.destroy(() => {});
      return res.status(403).json({ message: `Your account is suspended until ${until}.` });
    }

    next();
  } catch (err) {
    next(); // On error, let the request through
  }
};

module.exports = { requireLogin, requireRole, checkBanStatus };

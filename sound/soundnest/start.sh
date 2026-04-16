#!/bin/bash
# =============================================
# start.sh — Quick setup & launch script
# Run: bash start.sh
# =============================================

echo "🎵 Spotify Clone — Setup"
echo "========================"

# Check if Node is installed
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Install from https://nodejs.org"
  exit 1
fi

echo "✅ Node $(node -v) found"

# Check MongoDB
if ! command -v mongod &> /dev/null; then
  echo "⚠️  mongod not in PATH — make sure MongoDB is running"
else
  echo " MongoDB found"
fi

# Install server dependencies
echo ""
echo " Installing server dependencies..."
cd server && npm install
cd ..

# Install client dependencies
echo ""
echo " Installing client dependencies..."
cd client && npm install
cd ..

# Seed demo users
echo ""
echo " Seeding demo users..."
cd server && node seed.js
cd ..

echo ""
echo " Setup complete!"
echo ""
echo "  To run the app:"
echo "   Terminal 1: cd server && npm run dev"
echo "   Terminal 2: cd client && npm start"
echo ""
echo " Then open: http://localhost:3000"
echo ""
echo " Demo logins:"
echo "   admin@demo.com   / admin123"
echo "   artist@demo.com  / artist123"
echo "   premium@demo.com / premium123"
echo "   user@demo.com    / user1234"
echo "   (or visit /guest — no login needed)"

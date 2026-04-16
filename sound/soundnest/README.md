# 🎵 Spotify Clone — MERN Stack

A beginner-friendly full-stack music streaming app built with MongoDB, Express, React, and Node.js.

---

## 📁 Project Structure

```
spotify-clone/
├── server/                  ← Node.js + Express backend
│   ├── index.js             ← Main server file
│   ├── seed.js              ← Create demo users
│   ├── models/
│   │   ├── User.js          ← User schema
│   │   ├── Song.js          ← Song schema
│   │   └── Playlist.js      ← Playlist schema
│   ├── routes/
│   │   ├── auth.js          ← /api/auth (login, signup, logout)
│   │   ├── songs.js         ← /api/songs (CRUD)
│   │   ├── users.js         ← /api/users (admin only)
│   │   └── playlists.js     ← /api/playlists (premium)
│   ├── middleware/
│   │   └── auth.js          ← requireLogin, requireRole
│   └── uploads/             ← Uploaded audio files (auto-created)
│
└── client/                  ← React frontend
    ├── public/
    │   └── index.html       ← Bootstrap + AngularJS + jQuery CDN
    └── src/
        ├── App.js           ← Routes + role-based protection
        ├── App.css          ← Spotify-inspired dark theme
        ├── index.js         ← React entry point
        ├── context/
        │   ├── AuthContext.js    ← Global user/session state
        │   └── PlayerContext.js  ← Global music player state
        ├── components/
        │   ├── Navbar.js         ← Top bar (back/forward/logout)
        │   ├── Sidebar.js        ← Left sidebar (role-based links)
        │   ├── MusicPlayer.js    ← Bottom player bar
        │   └── SongCard.js       ← Reusable song card
        └── pages/
            ├── LoginPage.js      ← AngularJS form validation
            ├── SignupPage.js     ← AngularJS form validation
            ├── AdminDashboard.js ← Songs + Users + Upload
            ├── ArtistDashboard.js← Upload + manage own songs
            ├── PremiumDashboard.js← Like + Playlists
            ├── UserDashboard.js  ← Browse + play
            └── GuestDashboard.js ← Preview (no login needed)
```

---

## ⚡ Quick Start

### Step 1 — Prerequisites

- Node.js v18+ → https://nodejs.org
- MongoDB (local or Atlas) → https://www.mongodb.com

### Step 2 — Install Server Dependencies

```bash
cd spotify-clone/server
npm install
```

### Step 3 — Install Client Dependencies

```bash
cd spotify-clone/client
npm install
```

### Step 4 — Configure MongoDB

Edit `server/index.js` line 12:
```js
const MONGO_URI = 'mongodb://127.0.0.1:27017/spotify_clone';
// OR your Atlas URI:
// const MONGO_URI = 'mongodb+srv://user:pass@cluster.mongodb.net/spotify_clone';
```

### Step 5 — Seed Demo Users

```bash
cd server
node seed.js
```

This creates these accounts:

| Role    | Email              | Password   |
|---------|--------------------|------------|
| Admin   | admin@demo.com     | admin123   |
| Artist  | artist@demo.com    | artist123  |
| Premium | premium@demo.com   | premium123 |
| User    | user@demo.com      | user1234   |

### Step 6 — Start the Servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev    # uses nodemon for auto-reload
# OR
npm start
```

**Terminal 2 — Frontend:**
```bash
cd client
npm start
```

### Step 7 — Open in Browser

```
http://localhost:3000
```

---

## 👥 User Roles & Permissions

| Feature             | Guest | User | Premium | Artist | Admin |
|---------------------|-------|------|---------|--------|-------|
| View songs          | ✅ (6) | ✅  | ✅      | ✅     | ✅    |
| Play songs          | ✅    | ✅   | ✅      | ✅     | ✅    |
| Like songs          | ❌    | ❌   | ✅      | ❌     | ✅    |
| Create playlists    | ❌    | ❌   | ✅      | ❌     | ✅    |
| Upload songs        | ❌    | ❌   | ❌      | ✅     | ✅    |
| Delete songs        | ❌    | ❌   | ❌      | ❌     | ✅    |
| View all users      | ❌    | ❌   | ❌      | ❌     | ✅    |
| Delete users        | ❌    | ❌   | ❌      | ❌     | ✅    |

---

## 🔐 Role Routes

| Role    | Route     |
|---------|-----------|
| Admin   | /admin    |
| Artist  | /artist   |
| Premium | /premium  |
| User    | /user     |
| Guest   | /guest    |

---

## 🔄 API Endpoints

```
POST   /api/auth/signup         Register new user
POST   /api/auth/login          Login
POST   /api/auth/logout         Logout
GET    /api/auth/me             Get session user

GET    /api/songs               All songs (public)
GET    /api/songs/:id           Single song
POST   /api/songs               Upload song (admin/artist)
DELETE /api/songs/:id           Delete song (admin only)
POST   /api/songs/:id/like      Like song (premium/admin)

GET    /api/users               All users (admin only)
DELETE /api/users/:id           Delete user (admin only)

GET    /api/playlists           My playlists (logged in)
POST   /api/playlists           Create playlist (premium)
POST   /api/playlists/:id/songs Add song to playlist
DELETE /api/playlists/:id       Delete playlist
```

---

## 🧩 Tech Stack Explained

| Tech | Purpose |
|------|---------|
| **React** | Frontend UI, routing, state |
| **AngularJS** | Form validation on login/signup pages |
| **jQuery/AJAX** | HTTP calls inside AngularJS controllers |
| **Bootstrap 5** | Responsive layout, tables, buttons |
| **Node.js + Express** | REST API backend |
| **MongoDB + Mongoose** | Database and schemas |
| **express-session + connect-mongo** | Session/cookie auth |
| **bcryptjs** | Password hashing |
| **multer** | File upload handling |

---

## 🎨 How AngularJS Form Validation Works

The login and signup pages use AngularJS (bootstrapped on a div, not the whole app — React owns the page).

```html
<!-- AngularJS validates this form -->
<form name="loginForm" ng-submit="submitLogin()" noValidate>
  <input type="email" name="email" ng-model="formData.email" required />
  <div ng-messages="loginForm.email.$error" ng-if="loginForm.email.$touched">
    <div ng-message="required">Email is required.</div>
    <div ng-message="email">Invalid email format.</div>
  </div>
</form>
```

After AngularJS validates and submits via `$.ajax()`, it dispatches a custom DOM event that React listens to and uses to update the auth context.

---

## 🐛 Troubleshooting

**CORS error?** Make sure both servers are running (port 3000 + 5000).

**Session not persisting?** Ensure `withCredentials: true` on all fetch/AJAX calls.

**MongoDB connection failed?** Check your MONGO_URI and that MongoDB is running (`mongod`).

**File upload 400 error?** Make sure you're selecting an actual audio file (MP3/WAV/OGG).

**AngularJS not validating?** Open browser console — ensure AngularJS and ngMessages CDN scripts loaded.

// =============================================
// client/src/pages/UserDashboard.js
// MODIFIED: added Recently Played + Song Comments & Ratings
// =============================================

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MusicPlayer from '../components/MusicPlayer';
import SongCard from '../components/SongCard';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';

// ---- Comment Modal Component ----
const CommentModal = ({ song, onClose }) => {
  const [comments, setComments]   = useState([]);
  const [text, setText]           = useState('');
  const [rating, setRating]       = useState(5);
  const [message, setMessage]     = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    fetch(`/api/comments/${song._id}`, { credentials: 'include' })
      .then(r => r.json())
      .then(setComments)
      .catch(() => setError('Could not load comments'));
  }, [song._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/comments/${song._id}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, rating }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments(prev => [data.comment, ...prev]);
        setText('');
        setRating(5);
        setMessage('Review posted! ⭐');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.message);
      }
    } catch {
      setError('Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  const avgRating = comments.length > 0
    ? (comments.reduce((s, c) => s + c.rating, 0) / comments.length).toFixed(1)
    : null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: '#181818', borderRadius: 12, padding: 28, width: '100%', maxWidth: 500,
        maxHeight: '80vh', overflowY: 'auto', border: '1px solid #282828',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h5 style={{ fontWeight: 700, marginBottom: 4 }}>{song.title}</h5>
            <div style={{ color: '#b3b3b3', fontSize: '0.9rem' }}>{song.artist}</div>
            {avgRating && (
              <div style={{ color: '#f39c12', fontSize: '0.9rem', marginTop: 4 }}>
                ⭐ {avgRating} / 5 &nbsp;
                <span style={{ color: '#b3b3b3' }}>({comments.length} review{comments.length !== 1 ? 's' : ''})</span>
              </div>
            )}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#b3b3b3', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        {/* Write review form */}
        <form onSubmit={handleSubmit} style={{ background: '#282828', borderRadius: 8, padding: 16, marginBottom: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 12, fontSize: '0.95rem' }}>Write a Review</div>

          {/* Star rating picker */}
          <div className="d-flex gap-1 mb-3">
            {[1,2,3,4,5].map(star => (
              <button key={star} type="button"
                onClick={() => setRating(star)}
                style={{ background: 'none', border: 'none', fontSize: '1.6rem', cursor: 'pointer',
                  color: star <= rating ? '#f39c12' : '#535353', padding: 0 }}>
                ★
              </button>
            ))}
            <span style={{ color: '#b3b3b3', fontSize: '0.85rem', alignSelf: 'center', marginLeft: 8 }}>
              {['', 'Terrible', 'Poor', 'Okay', 'Good', 'Amazing!'][rating]}
            </span>
          </div>

          <textarea
            className="form-control mb-3"
            placeholder="Share your thoughts about this song..."
            rows={3}
            value={text}
            onChange={e => setText(e.target.value)}
            style={{ background: '#1a1a1a', border: '1px solid #333', color: 'white', resize: 'none' }}
          />

          {message && <div style={{ color: '#1DB954', fontSize: '0.85rem', marginBottom: 8 }}>{message}</div>}
          {error   && <div style={{ color: '#e74c3c', fontSize: '0.85rem', marginBottom: 8 }}>{error}</div>}

          <button type="submit" disabled={loading || !text.trim()}
            style={{ background: '#1DB954', color: 'black', border: 'none', borderRadius: 20,
              padding: '8px 20px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
              opacity: (!text.trim() || loading) ? 0.5 : 1 }}>
            {loading ? 'Posting...' : 'Post Review'}
          </button>
        </form>

        {/* Comments list */}
        <div style={{ fontWeight: 600, marginBottom: 12 }}>Reviews ({comments.length})</div>
        {comments.length === 0 ? (
          <div style={{ color: '#535353', textAlign: 'center', padding: '20px 0' }}>
            No reviews yet. Be the first!
          </div>
        ) : (
          comments.map(c => (
            <div key={c._id} style={{ background: '#282828', borderRadius: 8, padding: 14, marginBottom: 10 }}>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.userName}</span>
                <span style={{ color: '#f39c12', fontSize: '0.9rem' }}>{'★'.repeat(c.rating)}{'☆'.repeat(5 - c.rating)}</span>
              </div>
              <div style={{ color: '#ccc', fontSize: '0.85rem' }}>{c.text}</div>
              <div style={{ color: '#535353', fontSize: '0.75rem', marginTop: 6 }}>
                {new Date(c.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ---- Main Dashboard ----
const UserDashboard = () => {
  // const { user }                        = useAuth();
  const { user, upgradeUser } = useAuth();
  const { recentlyPlayed }              = usePlayer();
  const [songs, setSongs]               = useState([]);
  const [search, setSearch]             = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [commentSong, setCommentSong]   = useState(null); // song to show modal for
const handleUpgrade = async () => {
  try {
    await upgradeUser();
    // role updates in context → App.js will auto-redirect to PremiumDashboard
  } catch (err) {
    alert('Upgrade failed. Please try again.');
  }
};
  useEffect(() => {
    fetch('/api/songs', { credentials: 'include' })
      .then(r => r.json())
      .then(setSongs)
      .catch(console.error);
  }, []);

  const genres = ['All', ...new Set(songs.map(s => s.genre || 'Pop'))];

  const filteredSongs = songs.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.artist.toLowerCase().includes(search.toLowerCase());
    const matchGenre = selectedGenre === 'All' || s.genre === selectedGenre;
    return matchSearch && matchGenre;
  });

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        {/* <Sidebar onTabChange={setActiveTab} /> */}
        <Sidebar onTabChange={() => {}} />
        <div className="page-content">

          {/* Greeting */}
          <div className="mb-4">
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p style={{ color: '#b3b3b3' }}>Ready to listen to some music?</p>
          </div>

          {/* NEW: Recently Played Section */}
          {recentlyPlayed.length > 0 && (
            <div className="mb-5">
              <div className="section-header">
                <i className="bi bi-clock-history me-2" style={{ color: '#1DB954' }}></i>
                Recently Played
              </div>
              <div className="row g-3">
                {recentlyPlayed.slice(0, 6).map(song => (
                  <div className="col-6 col-md-3 col-lg-2" key={song._id}>
                    <div style={{ position: 'relative' }}>
                      <SongCard song={song} allSongs={recentlyPlayed} />
                      {/* Comment button overlay */}
                      <button
                        onClick={e => { e.stopPropagation(); setCommentSong(song); }}
                        title="Reviews"
                        style={{
                          position: 'absolute', bottom: 8, right: 8,
                          background: 'rgba(0,0,0,0.7)', border: '1px solid #333',
                          color: '#f39c12', borderRadius: '50%', width: 28, height: 28,
                          cursor: 'pointer', fontSize: '0.75rem', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                        }}>
                        ★
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="mb-4">
            <div className="input-group" style={{ maxWidth: 400 }}>
              <span className="input-group-text" style={{ background: '#282828', border: 'none', color: '#b3b3b3' }}>
                <i className="bi bi-search"></i>
              </span>
              <input type="text" className="form-control" placeholder="Search songs or artists..."
                style={{ background: '#282828', border: 'none', color: 'white' }}
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {/* Genre filter */}
          <div className="d-flex gap-2 flex-wrap mb-4">
            {genres.map(g => (
              <button key={g} onClick={() => setSelectedGenre(g)} className="btn btn-sm"
                style={{
                  background: selectedGenre === g ? '#1DB954' : '#282828',
                  color: selectedGenre === g ? 'black' : '#b3b3b3',
                  border: 'none', borderRadius: 20, padding: '6px 16px',
                  fontWeight: selectedGenre === g ? 700 : 400,
                }}>
                {g}
              </button>
            ))}
          </div>

          <div className="section-header">
            {search ? `Results for "${search}"` : 'All Songs'} ({filteredSongs.length})
          </div>

          <div className="row g-3">
            {filteredSongs.map(song => (
              <div className="col-6 col-md-3 col-lg-2" key={song._id} style={{ position: 'relative' }}>
                <SongCard song={song} allSongs={filteredSongs} />
                {/* NEW: Review button on each card */}
                <button
                  onClick={e => { e.stopPropagation(); setCommentSong(song); }}
                  title="Reviews & Ratings"
                  style={{
                    position: 'absolute', bottom: 8, right: 8,
                    background: 'rgba(0,0,0,0.7)', border: '1px solid #333',
                    color: '#f39c12', borderRadius: '50%', width: 28, height: 28,
                    cursor: 'pointer', fontSize: '0.75rem', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                  ★
                </button>
              </div>
            ))}
            {filteredSongs.length === 0 && (
              <div style={{ color: '#b3b3b3', padding: '40px 0', textAlign: 'center', width: '100%' }}>
                <i className="bi bi-search" style={{ fontSize: '3rem', display: 'block', marginBottom: 12 }}></i>
                No songs found
              </div>
            )}
          </div>

          {/* Upgrade banner */}
          <div style={{ background: 'linear-gradient(90deg, #1DB954, #148a3d)', borderRadius: 8, padding: '20px 24px', marginTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Upgrade to Premium</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Like songs, create playlists, and more!</div>
            </div>
            {/* <button className="btn" style={{ background: 'black', color: 'white', borderRadius: 20, padding: '8px 20px', fontWeight: 700 }}>
              Upgrade
            </button> */}
            <button onClick={handleUpgrade} className="btn" style={{ background: 'black', color: 'white', borderRadius: 20, padding: '8px 20px', fontWeight: 700 }}>
  Upgrade
</button>
          </div>
        </div>
      </div>
      <MusicPlayer />

      {/* NEW: Comment Modal */}
      {commentSong && (
        <CommentModal song={commentSong} onClose={() => setCommentSong(null)} />
      )}
    </div>
  );
};

export default UserDashboard;

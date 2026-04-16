// Guest: VIEW songs only, sign up/login to play music
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GuestDashboard = () => {
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/songs')
      .then(r => r.json())
      .then(data => setSongs(data.slice(0, 6)))
      .catch(console.error);
  }, []);

  const gradients = [
    'linear-gradient(135deg, #1DB954, #0d7334)',
    'linear-gradient(135deg, #9b59b6, #6c3483)',
    'linear-gradient(135deg, #e74c3c, #922b21)',
    'linear-gradient(135deg, #3498db, #1a5276)',
    'linear-gradient(135deg, #f39c12, #9a6006)',
    'linear-gradient(135deg, #1abc9c, #0e6655)',
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#121212', color: 'white', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#000', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #282828'
      }}>
        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1DB954' }}>
        SoundNest</span>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-light rounded-pill" onClick={() => navigate('/signup')}>
            Sign up
          </button>
          <button className="btn btn-sm rounded-pill"style={{ background: '#1DB954', color: 'black', fontWeight: 700 }}onClick={() => navigate('/login')}>
            Log in</button></div></div>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)', borderRadius: 16, padding: '48px 40px', marginBottom: 48, textAlign: 'center'
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎵</div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: 12 }}>
            Music for everyone.</h1>
          <p style={{ color: '#b3b3b3', fontSize: '1.1rem', marginBottom: 28, maxWidth: 480, margin: '0 auto 28px' }}>
            Browse our song catalog below. Sign up free to start playing music!</p>
          <button className="btn"
            style={{ background: '#1DB954', color: 'black', borderRadius: 30, padding: '14px 40px', fontWeight: 700, fontSize: '1rem' }}
            onClick={() => navigate('/signup')}>
            Get Soun  dNest Free
          </button></div>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Song Catalog Preview</h2>
          <span style={{ color: '#b3b3b3', fontSize: '0.85rem' }}>
            Showing {songs.length} songs — <strong style={{ color: 'white' }}>Login to play</strong>
          </span>
        </div>
        <div className="row g-3 mb-5">
          {songs.map((song, idx) => (
            <div className="col-6 col-md-4 col-lg-3" key={song._id}>
              <div style={{ background: '#181818', borderRadius: 10, padding: 16, border: '1px solid #282828', position: 'relative', transition: 'background 0.2s',
                }} onMouseEnter={e => e.currentTarget.style.background = '#282828'} onMouseLeave={e => e.currentTarget.style.background = '#181818'}>
                <div style={{ width: '100%', aspectRatio: '1', borderRadius: 6, background: gradients[idx % gradients.length], display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, position: 'relative',}}>
                  <i className="bi bi-music-note-beamed" style={{ color: 'white', fontSize: '2rem', opacity: 0.8 }}></i>
                  <div onClick={() => navigate('/login')}
                    style={{position: 'absolute',inset: 0,background: 'rgba(0,0,0,0.55)',borderRadius: 6,display: 'flex',flexDirection: 'column',alignItems: 'center',justifyContent: 'center',cursor: 'pointer',opacity: 0,transition: 'opacity 0.2s',
                    }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                    <i className="bi bi-lock-fill" style={{ fontSize: '1.5rem', color: 'white', marginBottom: 4 }}></i>
                    <span style={{ color: 'white', fontSize: '0.72rem', fontWeight: 600 }}>Login to Play</span>
                  </div></div>
                <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {song.title}</div>
                <div style={{ color: '#b3b3b3', fontSize: '0.8rem', marginBottom: 8 }}>
                  {song.artist}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ background: '#282828', color: '#b3b3b3', borderRadius: 20, padding: '2px 10px', fontSize: '0.72rem' }}>
                    {song.genre || 'Pop'}
                  </span>
                  {song.likes > 0 && (
                    <span style={{ color: '#b3b3b3', fontSize: '0.75rem' }}>
                      <i className="bi bi-heart-fill me-1" style={{ color: '#e74c3c' }}></i>{song.likes}
                    </span>
                  )}</div></div></div>
          ))}
          {songs.length === 0 && (
            <div style={{ color: '#b3b3b3', padding: '40px', textAlign: 'center', width: '100%' }}>
              <i className="bi bi-music-note-list" style={{ fontSize: '3rem', display: 'block', marginBottom: 12 }}></i>
              No songs available to preview.</div>
          )}</div>
        <div style={{ background: '#181818', border: '1px solid #282828', borderRadius: 16, padding: '36px 40px', textAlign: 'center'
        }}>
          <i className="bi bi-lock-fill" style={{ fontSize: '2.5rem', color: '#1DB954', display: 'block', marginBottom: 16 }}></i>
          <div style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: 8 }}>
            Want to listen to music?
          </div>
          <p style={{ color: '#b3b3b3', marginBottom: 24, fontSize: '0.95rem' }}>
            Create a free account to play all songs. Go Premium for playlists, likes & recommendations.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <button className="btn"
              style={{ background: '#1DB954', color: 'black', borderRadius: 30, padding: '12px 32px', fontWeight: 700 }}
              onClick={() => navigate('/signup')}>
              <i className="bi bi-person-plus me-2"></i>Sign up free
            </button>
            <button className="btn btn-outline-light rounded-pill"
              style={{ padding: '12px 28px' }}
              onClick={() => navigate('/login')}>
              Log in</button></div></div></div></div>
  );
};
export default GuestDashboard;
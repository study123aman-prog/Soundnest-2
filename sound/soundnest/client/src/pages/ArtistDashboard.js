// =============================================
// client/src/pages/ArtistDashboard.js
// MODIFIED: added Edit Song tab + Song Stats tab
// =============================================

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MusicPlayer from '../components/MusicPlayer';
import SongCard from '../components/SongCard';

const ArtistDashboard = () => {
  const { user } = useAuth();
  const [songs, setSongs]             = useState([]);
  const [activeTab, setActiveTab]     = useState('songs');
  const [uploadForm, setUploadForm]   = useState({ title: '', artist: user?.name || '', album: '', genre: 'Pop' });
  const [uploadFile, setUploadFile]   = useState(null);
  const [message, setMessage]         = useState('');
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);

  // NEW: edit state
  const [editingSong, setEditingSong] = useState(null); // the song being edited
  const [editForm, setEditForm]       = useState({ title: '', artist: '', album: '', genre: 'Pop' });

  // NEW: stats state
  const [stats, setStats]             = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [selectedStatSong, setSelectedStatSong] = useState('');

  const fetchSongs = async () => {
    const res  = await fetch('/api/songs', { credentials: 'include' });
    const data = await res.json();
    setSongs(data.filter(s =>
      s.artist.toLowerCase() === user?.name?.toLowerCase() ||
      s.uploadedBy === user?.id
    ));
  };

  useEffect(() => { fetchSongs(); }, []);

  const showMsg = (msg, isErr = false) => {
    if (isErr) setError(msg); else setMessage(msg);
    setTimeout(() => { setMessage(''); setError(''); }, 3000);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return showMsg('Please select an audio file', true);
    setLoading(true);
    const formData = new FormData();
    Object.entries(uploadForm).forEach(([k, v]) => formData.append(k, v));
    formData.append('file', uploadFile);
    try {
      const res  = await fetch('/api/songs', { method: 'POST', credentials: 'include', body: formData });
      const data = await res.json();
      if (res.ok) {
        showMsg('Song uploaded!');
        setUploadForm({ title: '', artist: user?.name || '', album: '', genre: 'Pop' });
        setUploadFile(null);
        fetchSongs();
      } else {
        showMsg(data.message, true);
      }
    } catch { showMsg('Upload failed', true); }
    finally { setLoading(false); }
  };

  // NEW: open edit form pre-filled with existing song data
  const openEdit = (song) => {
    setEditingSong(song);
    setEditForm({ title: song.title, artist: song.artist, album: song.album || '', genre: song.genre || 'Pop' });
    setActiveTab('edit');
  };

  // NEW: submit edit
  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editingSong) return;
    setLoading(true);
    try {
      const res  = await fetch(`/api/songs/${editingSong._id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (res.ok) {
        showMsg('Song updated successfully!');
        setEditingSong(null);
        fetchSongs();
        setActiveTab('songs');
      } else {
        showMsg(data.message, true);
      }
    } catch { showMsg('Update failed', true); }
    finally { setLoading(false); }
  };

  // NEW: fetch stats for a selected song
  const fetchStats = async (songId) => {
    if (!songId) return;
    setStatsLoading(true);
    setStats(null);
    try {
      const res  = await fetch(`/api/songs/${songId}/stats`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok) setStats(data);
      else showMsg(data.message, true);
    } catch { showMsg('Failed to load stats', true); }
    finally { setStatsLoading(false); }
  };

  const tabs = [
    { id: 'songs',  label: 'My Songs' },
    { id: 'upload', label: 'Upload Song' },
    { id: 'edit',   label: 'Edit Song' },
    { id: 'stats',  label: 'Song Stats' },
  ];

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar onTabChange={setActiveTab} />
        <div className="page-content">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #9b59b6, #6c3483)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🎤</div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#b3b3b3', textTransform: 'uppercase', letterSpacing: 1 }}>Artist</div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>My Studio</h1>
            </div>
          </div>

          <ul className="nav nav-pills mb-4">
            {tabs.map(tab => (
              <li className="nav-item" key={tab.id}>
                <button className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                  style={activeTab === tab.id ? { background: '#9b59b6', color: 'white' } : { color: '#b3b3b3' }}
                  onClick={() => setActiveTab(tab.id)}>
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>

          {message && <div className="alert-spotify alert-success-spotify mb-3">{message}</div>}
          {error   && <div className="alert-spotify alert-error-spotify mb-3">{error}</div>}

          {/* My Songs Tab */}
          {activeTab === 'songs' && (
            <div>
              <div className="section-header">My Songs ({songs.length})</div>
              {songs.length === 0 && (
                <div style={{ color: '#b3b3b3', textAlign: 'center', padding: '40px 0' }}>
                  <i className="bi bi-music-note-list" style={{ fontSize: '3rem', display: 'block', marginBottom: 12 }}></i>
                  No songs yet. Upload your first track!
                </div>
              )}
              <div className="row g-3">
                {songs.map(song => (
                  <div className="col-6 col-md-3 col-lg-2" key={song._id}>
                    <SongCard song={song} allSongs={songs} />
                    {/* NEW: Edit button below each card */}
                    <button
                      onClick={() => openEdit(song)}
                      style={{
                        width: '100%', marginTop: 6, background: '#282828',
                        color: '#9b59b6', border: '1px solid #9b59b6',
                        borderRadius: 6, padding: '4px 0', fontSize: '0.8rem',
                        cursor: 'pointer', fontWeight: 600,
                      }}>
                      <i className="bi bi-pencil me-1"></i>Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div style={{ maxWidth: 500 }}>
              <div className="section-header">Upload New Track</div>
              <div style={{ background: '#181818', borderRadius: 8, padding: 24, border: '1px solid #282828' }}>
                <form onSubmit={handleUpload}>
                  <div className="mb-3">
                    <label className="form-label">Song Title *</label>
                    <input type="text" className="form-control" placeholder="Track title" required
                      value={uploadForm.title} onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Artist Name</label>
                    <input type="text" className="form-control" value={uploadForm.artist}
                      onChange={e => setUploadForm({ ...uploadForm, artist: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Album</label>
                    <input type="text" className="form-control" placeholder="Album (optional)"
                      value={uploadForm.album} onChange={e => setUploadForm({ ...uploadForm, album: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Genre</label>
                    <select className="form-select" value={uploadForm.genre} onChange={e => setUploadForm({ ...uploadForm, genre: e.target.value })}>
                      {['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Classical', 'Electronic', 'R&B', 'Country'].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Audio File *</label>
                    <div className="upload-zone" onClick={() => document.getElementById('artistAudio').click()}>
                      <i className="bi bi-cloud-upload" style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}></i>
                      {uploadFile ? uploadFile.name : 'Click to select MP3 / WAV / OGG'}
                    </div>
                    <input id="artistAudio" type="file" accept="audio/*" style={{ display: 'none' }}
                      onChange={e => setUploadFile(e.target.files[0])} />
                  </div>
                  <button type="submit" className="btn-spotify" disabled={loading} style={{ background: '#9b59b6' }}>
                    {loading ? 'Uploading...' : 'Release Track'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* NEW: Edit Song Tab */}
          {activeTab === 'edit' && (
            <div style={{ maxWidth: 500 }}>
              <div className="section-header">Edit Song</div>
              {!editingSong ? (
                <div style={{ background: '#181818', borderRadius: 8, padding: 24, border: '1px solid #282828' }}>
                  <p style={{ color: '#b3b3b3', marginBottom: 16 }}>Select a song to edit from the My Songs tab, or pick one below:</p>
                  {songs.length === 0 ? (
                    <div style={{ color: '#535353' }}>No songs to edit yet.</div>
                  ) : (
                    songs.map(song => (
                      <button key={song._id} onClick={() => openEdit(song)}
                        style={{ display: 'block', width: '100%', textAlign: 'left', background: '#282828', border: '1px solid #333', borderRadius: 8, padding: '12px 16px', marginBottom: 8, color: 'white', cursor: 'pointer' }}>
                        <div style={{ fontWeight: 600 }}>{song.title}</div>
                        <div style={{ color: '#b3b3b3', fontSize: '0.85rem' }}>{song.artist} — {song.genre}</div>
                      </button>
                    ))
                  )}
                </div>
              ) : (
                <div style={{ background: '#181818', borderRadius: 8, padding: 24, border: '1px solid #282828' }}>
                  <div style={{ color: '#9b59b6', fontWeight: 600, marginBottom: 16 }}>
                    Editing: {editingSong.title}
                  </div>
                  <form onSubmit={handleEdit}>
                    <div className="mb-3">
                      <label className="form-label">Song Title</label>
                      <input type="text" className="form-control" value={editForm.title}
                        onChange={e => setEditForm({ ...editForm, title: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Artist Name</label>
                      <input type="text" className="form-control" value={editForm.artist}
                        onChange={e => setEditForm({ ...editForm, artist: e.target.value })} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Album</label>
                      <input type="text" className="form-control" value={editForm.album}
                        onChange={e => setEditForm({ ...editForm, album: e.target.value })} />
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Genre</label>
                      <select className="form-select" value={editForm.genre} onChange={e => setEditForm({ ...editForm, genre: e.target.value })}>
                        {['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Classical', 'Electronic', 'R&B', 'Country'].map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" disabled={loading}
                        style={{ background: '#9b59b6', color: 'white', border: 'none', borderRadius: 20, padding: '10px 24px', fontWeight: 700, cursor: 'pointer' }}>
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button type="button" onClick={() => { setEditingSong(null); setActiveTab('songs'); }}
                        style={{ background: '#282828', color: '#b3b3b3', border: '1px solid #333', borderRadius: 20, padding: '10px 20px', cursor: 'pointer' }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* NEW: Song Stats Tab */}
          {activeTab === 'stats' && (
            <div style={{ maxWidth: 600 }}>
              <div className="section-header">Song Performance Stats</div>
              <div style={{ background: '#181818', borderRadius: 8, padding: 24, border: '1px solid #282828' }}>
                <div className="mb-4">
                  <label className="form-label">Select a Song</label>
                  <select className="form-select"
                    value={selectedStatSong}
                    onChange={e => { setSelectedStatSong(e.target.value); fetchStats(e.target.value); }}>
                    <option value="">-- Choose a song --</option>
                    {songs.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
                  </select>
                </div>

                {statsLoading && (
                  <div style={{ color: '#b3b3b3', textAlign: 'center', padding: 20 }}>Loading stats...</div>
                )}

                {stats && !statsLoading && (
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 4 }}>{stats.title}</div>
                    <div style={{ color: '#b3b3b3', marginBottom: 24 }}>{stats.artist}</div>

                    <div className="row g-3">
                      {[
                        { label: 'Total Likes',    value: stats.likes,         icon: 'heart-fill',     color: '#e74c3c' },
                        { label: 'Reviews',        value: stats.totalComments, icon: 'chat-left-text', color: '#3498db' },
                        { label: 'Avg Rating',     value: stats.avgRating ? `${stats.avgRating} / 5` : 'No ratings', icon: 'star-fill', color: '#f39c12' },
                        { label: 'Uploaded',       value: new Date(stats.uploadedAt).toLocaleDateString(), icon: 'calendar', color: '#1DB954' },
                      ].map(stat => (
                        <div className="col-6" key={stat.label}>
                          <div style={{ background: '#282828', borderRadius: 8, padding: 16, textAlign: 'center' }}>
                            <i className={`bi bi-${stat.icon}`} style={{ color: stat.color, fontSize: '1.5rem' }}></i>
                            <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: 8 }}>{stat.value}</div>
                            <div style={{ color: '#b3b3b3', fontSize: '0.85rem' }}>{stat.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Rating bar visual */}
                    {stats.avgRating && (
                      <div style={{ marginTop: 20 }}>
                        <div style={{ color: '#b3b3b3', fontSize: '0.85rem', marginBottom: 6 }}>Average Rating</div>
                        <div style={{ background: '#282828', borderRadius: 20, height: 10, overflow: 'hidden' }}>
                          <div style={{
                            width: `${(stats.avgRating / 5) * 100}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #f39c12, #e67e22)',
                            borderRadius: 20,
                            transition: 'width 0.6s ease',
                          }} />
                        </div>
                        <div style={{ color: '#f39c12', fontSize: '0.9rem', marginTop: 4 }}>
                          ⭐ {stats.avgRating} out of 5
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!selectedStatSong && !statsLoading && (
                  <div style={{ color: '#535353', textAlign: 'center', padding: '20px 0' }}>
                    <i className="bi bi-bar-chart" style={{ fontSize: '3rem', display: 'block', marginBottom: 12 }}></i>
                    Select a song above to view its performance
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
      <MusicPlayer />
    </div>
  );
};

export default ArtistDashboard;

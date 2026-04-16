// =============================================
// client/src/pages/AdminDashboard.js
// MODIFIED: added Ban/Suspend users + Analytics tab
// =============================================

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MusicPlayer from '../components/MusicPlayer';
import SongCard from '../components/SongCard';

const AdminDashboard = () => {
  const [songs, setSongs]         = useState([]);
  const [users, setUsers]         = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('songs');
  const [uploadForm, setUploadForm] = useState({ title: '', artist: '', album: '', genre: 'Pop' });
  const [uploadFile, setUploadFile] = useState(null);
  const [message, setMessage]     = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [suspendDays, setSuspendDays] = useState({}); // { userId: days }

  const showMsg = (msg, isErr = false) => {
    if (isErr) setError(msg); else setMessage(msg);
    setTimeout(() => { setMessage(''); setError(''); }, 4000);
  };

  const fetchSongs = async () => {
    try {
      const res  = await fetch('/api/songs', { credentials: 'include' });
      setSongs(await res.json());
    } catch { showMsg('Failed to load songs', true); }
  };

  const fetchUsers = async () => {
    try {
      const res  = await fetch('/api/users', { credentials: 'include' });
      setUsers(await res.json());
    } catch { showMsg('Failed to load users', true); }
  };

  const fetchAnalytics = async () => {
    try {
      const res  = await fetch('/api/users/analytics', { credentials: 'include' });
      const data = await res.json();
      if (res.ok) setAnalytics(data);
    } catch { showMsg('Failed to load analytics', true); }
  };

  useEffect(() => {
    fetchSongs();
    fetchUsers();
    fetchAnalytics();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return showMsg('Please select an audio file', true);
    setLoading(true);
    const formData = new FormData();
    formData.append('title', uploadForm.title);
    formData.append('artist', uploadForm.artist);
    formData.append('album', uploadForm.album);
    formData.append('genre', uploadForm.genre);
    formData.append('file', uploadFile);
    try {
      const res  = await fetch('/api/songs', { method: 'POST', credentials: 'include', body: formData });
      const data = await res.json();
      if (res.ok) {
        showMsg('Song uploaded successfully!');
        setUploadForm({ title: '', artist: '', album: '', genre: 'Pop' });
        setUploadFile(null);
        fetchSongs();
        fetchAnalytics();
      } else { showMsg(data.message, true); }
    } catch { showMsg('Upload failed', true); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this song?')) return;
    try {
      await fetch(`/api/songs/${id}`, { method: 'DELETE', credentials: 'include' });
      setSongs(songs.filter(s => s._id !== id));
      showMsg('Song deleted');
      fetchAnalytics();
    } catch { showMsg('Delete failed', true); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE', credentials: 'include' });
      setUsers(users.filter(u => u._id !== id));
      showMsg('User deleted');
      fetchAnalytics();
    } catch { showMsg('Delete failed', true); }
  };

  // NEW: Ban user permanently
  const handleBan = async (id, name) => {
    if (!window.confirm(`Permanently ban ${name}? They will not be able to log in.`)) return;
    try {
      const res  = await fetch(`/api/users/${id}/ban`, { method: 'PATCH', credentials: 'include' });
      const data = await res.json();
      if (res.ok) { showMsg(data.message); fetchUsers(); fetchAnalytics(); }
      else showMsg(data.message, true);
    } catch { showMsg('Ban failed', true); }
  };

  // NEW: Unban user
  const handleUnban = async (id, name) => {
    try {
      const res  = await fetch(`/api/users/${id}/unban`, { method: 'PATCH', credentials: 'include' });
      const data = await res.json();
      if (res.ok) { showMsg(data.message); fetchUsers(); fetchAnalytics(); }
      else showMsg(data.message, true);
    } catch { showMsg('Unban failed', true); }
  };

  // NEW: Suspend user for N days
  const handleSuspend = async (id, name) => {
    const days = suspendDays[id];
    if (!days || days < 1) return showMsg('Enter number of days first', true);
    if (!window.confirm(`Suspend ${name} for ${days} day(s)?`)) return;
    try {
      const res  = await fetch(`/api/users/${id}/suspend`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days }),
      });
      const data = await res.json();
      if (res.ok) {
        showMsg(data.message);
        setSuspendDays(prev => ({ ...prev, [id]: '' }));
        fetchUsers();
      } else showMsg(data.message, true);
    } catch { showMsg('Suspend failed', true); }
  };

  // Helper: is user currently suspended?
  const isSuspended = (user) => {
    if (!user.suspendedUntil) return false;
    return new Date() < new Date(user.suspendedUntil);
  };

  const tabs = [
    { id: 'songs',     label: 'Songs' },
    { id: 'users',     label: 'Users' },
    { id: 'upload',    label: 'Upload' },
    { id: 'analytics', label: '📊 Analytics' },
  ];

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar onTabChange={setActiveTab} />
        <div className="page-content">

          {/* Header */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #e74c3c, #c0392b)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>👑</div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#b3b3b3', textTransform: 'uppercase', letterSpacing: 1 }}>Dashboard</div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Admin Panel</h1>
            </div>
          </div>

          {/* Quick stats */}
          <div className="row g-3 mb-4">
            {[
              { label: 'Total Songs',  value: songs.length,                               icon: 'music-note-list', color: '#1DB954' },
              { label: 'Total Users',  value: users.length,                               icon: 'people-fill',     color: '#3498db' },
              { label: 'Artists',      value: users.filter(u => u.role === 'artist').length, icon: 'mic-fill',     color: '#9b59b6' },
              { label: 'Banned',       value: users.filter(u => u.isBanned).length,        icon: 'slash-circle',   color: '#e74c3c' },
            ].map(stat => (
              <div className="col-6 col-md-3" key={stat.label}>
                <div style={{ background: '#181818', borderRadius: 8, padding: '20px', border: '1px solid #282828' }}>
                  <i className={`bi bi-${stat.icon}`} style={{ color: stat.color, fontSize: '1.5rem' }}></i>
                  <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: 8 }}>{stat.value}</div>
                  <div style={{ color: '#b3b3b3', fontSize: '0.85rem' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <ul className="nav nav-pills mb-4">
            {tabs.map(tab => (
              <li className="nav-item" key={tab.id}>
                <button className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                  style={activeTab === tab.id ? { background: '#1DB954', color: 'black' } : { color: '#b3b3b3' }}
                  onClick={() => setActiveTab(tab.id)}>
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>

          {message && <div className="alert-spotify alert-success-spotify mb-3">{message}</div>}
          {error   && <div className="alert-spotify alert-error-spotify mb-3">{error}</div>}

          {/* Songs Tab */}
          {activeTab === 'songs' && (
            <div id="songs">
              <div className="section-header">All Songs ({songs.length})</div>
              <div className="row g-3">
                {songs.map(song => (
                  <div className="col-6 col-md-3 col-lg-2" key={song._id}>
                    <SongCard song={song} allSongs={songs} showDelete onDelete={handleDelete} />
                  </div>
                ))}
                {songs.length === 0 && <div style={{ color: '#b3b3b3' }}>No songs yet.</div>}
              </div>
            </div>
          )}

          {/* Users Tab — with ban/suspend */}
          {activeTab === 'users' && (
            <div id="users">
              <div className="section-header">All Users ({users.length})</div>
              <div style={{ background: '#181818', borderRadius: 8, overflow: 'hidden', border: '1px solid #282828' }}>
                <table className="table dark-table mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th style={{ minWidth: 260 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u._id} style={{ opacity: u.isBanned ? 0.6 : 1 }}>
                        <td style={{ color: '#b3b3b3' }}>{i + 1}</td>
                        <td>{u.name}</td>
                        <td style={{ color: '#b3b3b3' }}>{u.email}</td>
                        <td><span className={`role-badge role-${u.role}`}>{u.role}</span></td>
                        <td>
                          {u.isBanned ? (
                            <span style={{ background: '#e74c3c', color: 'white', borderRadius: 12, padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700 }}>BANNED</span>
                          ) : isSuspended(u) ? (
                            <span style={{ background: '#f39c12', color: 'black', borderRadius: 12, padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700 }}>
                              SUSPENDED until {new Date(u.suspendedUntil).toLocaleDateString()}
                            </span>
                          ) : (
                            <span style={{ color: '#1DB954', fontSize: '0.8rem' }}>✓ Active</span>
                          )}
                        </td>
                        <td style={{ color: '#b3b3b3', fontSize: '0.85rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>
                          {u.role !== 'admin' && (
                            <div className="d-flex gap-1 flex-wrap align-items-center">
                              {/* Ban / Unban toggle */}
                              {u.isBanned ? (
                                <button className="btn btn-sm" title="Unban"
                                  style={{ background: '#1DB954', color: 'black', border: 'none', borderRadius: 12, padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700 }}
                                  onClick={() => handleUnban(u._id, u.name)}>
                                  Unban
                                </button>
                              ) : (
                                <button className="btn btn-sm" title="Permanent ban"
                                  style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: 12, padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700 }}
                                  onClick={() => handleBan(u._id, u.name)}>
                                  Ban
                                </button>
                              )}

                              {/* Suspend: days input + button */}
                              {!u.isBanned && (
                                <>
                                  <input
                                    type="number" min="1" max="365" placeholder="days"
                                    value={suspendDays[u._id] || ''}
                                    onChange={e => setSuspendDays(prev => ({ ...prev, [u._id]: e.target.value }))}
                                    style={{ width: 60, background: '#282828', border: '1px solid #333', color: 'white', borderRadius: 6, padding: '2px 6px', fontSize: '0.75rem' }}
                                  />
                                  <button className="btn btn-sm" title="Suspend"
                                    style={{ background: '#f39c12', color: 'black', border: 'none', borderRadius: 12, padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700 }}
                                    onClick={() => handleSuspend(u._id, u.name)}>
                                    Suspend
                                  </button>
                                </>
                              )}

                              {/* Delete */}
                              <button className="btn btn-sm btn-outline-danger"
                                style={{ borderRadius: 12, padding: '2px 8px', fontSize: '0.75rem' }}
                                onClick={() => handleDeleteUser(u._id)}>
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          )}
                          {u.role === 'admin' && <span style={{ color: '#535353', fontSize: '0.8rem' }}>Protected</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div id="upload" style={{ maxWidth: 500 }}>
              <div className="section-header">Upload New Song</div>
              <div style={{ background: '#181818', borderRadius: 8, padding: 24, border: '1px solid #282828' }}>
                <form onSubmit={handleUpload}>
                  <div className="mb-3">
                    <label className="form-label">Song Title *</label>
                    <input type="text" className="form-control" placeholder="Song title" required
                      value={uploadForm.title} onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Artist Name *</label>
                    <input type="text" className="form-control" placeholder="Artist name" required
                      value={uploadForm.artist} onChange={e => setUploadForm({ ...uploadForm, artist: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Album</label>
                    <input type="text" className="form-control" placeholder="Album name"
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
                    <label className="form-label">Audio File * (MP3, WAV, OGG)</label>
                    <div className="upload-zone" onClick={() => document.getElementById('audioInput').click()}>
                      <i className="bi bi-cloud-upload" style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}></i>
                      {uploadFile ? uploadFile.name : 'Click to select audio file'}
                    </div>
                    <input id="audioInput" type="file" accept="audio/*" style={{ display: 'none' }}
                      onChange={e => setUploadFile(e.target.files[0])} />
                  </div>
                  <button type="submit" className="btn-spotify" disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload Song'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* NEW: Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <div className="section-header">Analytics Dashboard</div>
              {!analytics ? (
                <div style={{ color: '#b3b3b3', textAlign: 'center', padding: 40 }}>Loading analytics...</div>
              ) : (
                <>
                  {/* Overview cards */}
                  <div className="row g-3 mb-4">
                    {[
                      { label: 'Total Users',      value: analytics.totalUsers,    icon: 'people-fill',    color: '#3498db' },
                      { label: 'Total Songs',      value: analytics.totalSongs,    icon: 'music-note-list', color: '#1DB954' },
                      { label: 'Total Reviews',    value: analytics.totalComments, icon: 'chat-left-text', color: '#9b59b6' },
                      { label: 'New (Last 7 Days)', value: analytics.recentSignups, icon: 'person-plus',   color: '#f39c12' },
                      { label: 'Banned Users',     value: analytics.bannedCount,   icon: 'slash-circle',   color: '#e74c3c' },
                      { label: 'Suspended',        value: analytics.suspendedCount, icon: 'pause-circle',  color: '#e67e22' },
                    ].map(stat => (
                      <div className="col-6 col-md-4 col-lg-2" key={stat.label}>
                        <div style={{ background: '#181818', borderRadius: 8, padding: 16, border: '1px solid #282828', textAlign: 'center' }}>
                          <i className={`bi bi-${stat.icon}`} style={{ color: stat.color, fontSize: '1.4rem' }}></i>
                          <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: 6 }}>{stat.value}</div>
                          <div style={{ color: '#b3b3b3', fontSize: '0.78rem' }}>{stat.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="row g-4">
                    {/* Top 5 most liked songs */}
                    <div className="col-12 col-md-6">
                      <div style={{ background: '#181818', borderRadius: 8, padding: 20, border: '1px solid #282828', height: '100%' }}>
                        <div style={{ fontWeight: 700, marginBottom: 16 }}>
                          <i className="bi bi-heart-fill me-2" style={{ color: '#e74c3c' }}></i>
                          Top 5 Most Liked Songs
                        </div>
                        {analytics.topSongs.length === 0 ? (
                          <div style={{ color: '#535353' }}>No likes yet</div>
                        ) : (
                          analytics.topSongs.map((song, i) => (
                            <div key={song._id} className="d-flex justify-content-between align-items-center"
                              style={{ padding: '10px 0', borderBottom: i < analytics.topSongs.length - 1 ? '1px solid #282828' : 'none' }}>
                              <div className="d-flex align-items-center gap-2">
                                <span style={{ color: '#535353', width: 20, textAlign: 'right', fontWeight: 700 }}>{i + 1}</span>
                                <div>
                                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{song.title}</div>
                                  <div style={{ color: '#b3b3b3', fontSize: '0.8rem' }}>{song.artist}</div>
                                </div>
                              </div>
                              <span style={{ color: '#e74c3c', fontWeight: 700, fontSize: '0.9rem' }}>
                                <i className="bi bi-heart-fill me-1"></i>{song.likes}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Songs by genre */}
                    <div className="col-12 col-md-6">
                      <div style={{ background: '#181818', borderRadius: 8, padding: 20, border: '1px solid #282828', height: '100%' }}>
                        <div style={{ fontWeight: 700, marginBottom: 16 }}>
                          <i className="bi bi-pie-chart me-2" style={{ color: '#1DB954' }}></i>
                          Songs by Genre
                        </div>
                        {analytics.songsByGenre.length === 0 ? (
                          <div style={{ color: '#535353' }}>No songs yet</div>
                        ) : (
                          analytics.songsByGenre.map((g) => {
                            const pct = analytics.totalSongs > 0 ? Math.round((g.count / analytics.totalSongs) * 100) : 0;
                            return (
                              <div key={g._id} style={{ marginBottom: 12 }}>
                                <div className="d-flex justify-content-between mb-1">
                                  <span style={{ fontSize: '0.85rem' }}>{g._id || 'Unknown'}</span>
                                  <span style={{ color: '#b3b3b3', fontSize: '0.85rem' }}>{g.count} songs ({pct}%)</span>
                                </div>
                                <div style={{ background: '#282828', borderRadius: 20, height: 8 }}>
                                  <div style={{
                                    width: `${pct}%`, height: '100%',
                                    background: 'linear-gradient(90deg, #1DB954, #148a3d)',
                                    borderRadius: 20, minWidth: pct > 0 ? 8 : 0,
                                  }} />
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Users by role */}
                    <div className="col-12 col-md-6">
                      <div style={{ background: '#181818', borderRadius: 8, padding: 20, border: '1px solid #282828' }}>
                        <div style={{ fontWeight: 700, marginBottom: 16 }}>
                          <i className="bi bi-people me-2" style={{ color: '#3498db' }}></i>
                          Users by Role
                        </div>
                        {analytics.usersByRole.map((r) => {
                          const colors = { admin: '#e74c3c', artist: '#9b59b6', premium: '#f39c12', user: '#3498db', guest: '#535353' };
                          const pct = analytics.totalUsers > 0 ? Math.round((r.count / analytics.totalUsers) * 100) : 0;
                          return (
                            <div key={r._id} style={{ marginBottom: 12 }}>
                              <div className="d-flex justify-content-between mb-1">
                                <span style={{ fontSize: '0.85rem', textTransform: 'capitalize' }}>{r._id}</span>
                                <span style={{ color: '#b3b3b3', fontSize: '0.85rem' }}>{r.count} ({pct}%)</span>
                              </div>
                              <div style={{ background: '#282828', borderRadius: 20, height: 8 }}>
                                <div style={{
                                  width: `${pct}%`, height: '100%',
                                  background: colors[r._id] || '#535353',
                                  borderRadius: 20, minWidth: pct > 0 ? 8 : 0,
                                }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>
      <MusicPlayer />
    </div>
  );
};

export default AdminDashboard;

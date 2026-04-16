// import React from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const Sidebar = ({ onTabChange }) => {
//   const { user } = useAuth();

//   if (!user) return null;

//   const scrollTo = (id) => {
//     const el = document.getElementById(id);
//     if (el) el.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleClick = (e, id) => {
//     e.preventDefault();
//     if (onTabChange) {
//       onTabChange(id); // switch tab if dashboard supports it
//     } else {
//       scrollTo(id);    // otherwise scroll to section
//     }
//   };

//   const Link = ({ id, icon, children }) => (
//     <a href={`#${id}`} onClick={(e) => handleClick(e, id)}
//       style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px',
//         borderRadius:6, color:'#b3b3b3', textDecoration:'none', fontSize:'0.9rem',
//         fontWeight:500, marginBottom:4, cursor:'pointer' }}
//       onMouseEnter={e => { e.currentTarget.style.color='white'; e.currentTarget.style.background='#282828'; }}
//       onMouseLeave={e => { e.currentTarget.style.color='#b3b3b3'; e.currentTarget.style.background='transparent'; }}>
//       <i className={`bi ${icon}`} style={{ fontSize:'1.1rem' }}></i> {children}
//     </a>
//   );

//   const Label = ({ children }) => (
//     <div style={{ color:'#535353', fontSize:'0.75rem', padding:'16px 12px 8px',
//       textTransform:'uppercase', letterSpacing:'1px' }}>{children}</div>
//   );

//   return (
//     <div className="sidebar">
//       <div className="sidebar-logo"> SoundNest</div>
//       <nav className="sidebar-nav">

//         <NavLink to={`/${user.role}`}>
//           <i className="bi bi-house-fill"></i> Home
//         </NavLink>

//         {user.role === 'admin' && (
//           <>
//             <Label>Admin</Label>
//             <Link id="songs" icon="bi-music-note-list">All Songs</Link>
//             <Link id="users" icon="bi-people-fill">All Users</Link>
//             <Link id="upload" icon="bi-cloud-upload">Add Song</Link>
//           </>
//         )}

//         {user.role === 'artist' && (
//           <>
//             <Label>Artist</Label>
//             <Link id="songs" icon="bi-music-note-list">My Songs</Link>
//             <Link id="upload" icon="bi-cloud-upload">Upload Song</Link>
//           </>
//         )}

//         {user.role === 'premium' && (
//           <>
//             <Label>Premium</Label>
//             <Link id="songs" icon="bi-music-note-list">All Songs</Link>
//             <Link id="playlists" icon="bi-collection-play">My Playlists</Link>
            
//           </>
//         )}

//         {user.role === 'user' && (
//           <>
//             <Label>Library</Label>
//             <Link id="songs" icon="bi-music-note-list">All Songs</Link>
//           </>
//         )}

//       </nav>
//     </div>
//   );
// };

// export default Sidebar;

// import React from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const Sidebar = ({ onTabChange }) => {
//   const { user } = useAuth();

//   if (!user) return null;

//   const scrollTo = (id) => {
//     const el = document.getElementById(id);
//     if (el) el.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleClick = (e, id) => {
//     e.preventDefault();
//     if (onTabChange) {
//       onTabChange(id);
//     } else {
//       scrollTo(id);
//     }
//   };

//   const Link = ({ id, icon, children, iconColor }) => (
//     <a href={`#${id}`} onClick={(e) => handleClick(e, id)}
//       style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px',
//         borderRadius:6, color:'#b3b3b3', textDecoration:'none', fontSize:'0.9rem',
//         fontWeight:500, marginBottom:4, cursor:'pointer' }}
//       onMouseEnter={e => { e.currentTarget.style.color='white'; e.currentTarget.style.background='#282828'; }}
//       onMouseLeave={e => { e.currentTarget.style.color='#b3b3b3'; e.currentTarget.style.background='transparent'; }}>
//       <i className={`bi ${icon}`} style={{ fontSize:'1.1rem', color: iconColor || 'inherit' }}></i> {children}
//     </a>
//   );

//   const Label = ({ children }) => (
//     <div style={{ color:'#535353', fontSize:'0.75rem', padding:'16px 12px 8px',
//       textTransform:'uppercase', letterSpacing:'1px' }}>{children}</div>
//   );

//   return (
//     <div className="sidebar">
//       <div className="sidebar-logo">SoundNest</div>
//       <nav className="sidebar-nav">

//         <NavLink to={`/${user.role}`}>
//           <i className="bi bi-house-fill"></i> Home
//         </NavLink>

//         {user.role === 'admin' && (
//           <>
//             <Label>Admin</Label>
//             <Link id="songs" icon="bi-music-note-list">All Songs</Link>
//             <Link id="users" icon="bi-people-fill">All Users</Link>
//             <Link id="upload" icon="bi-cloud-upload">Add Song</Link>
//           </>
//         )}

//         {user.role === 'artist' && (
//           <>
//             <Label>Artist</Label>
//             <Link id="songs" icon="bi-music-note-list">My Songs</Link>
//             <Link id="upload" icon="bi-cloud-upload">Upload Song</Link>
//           </>
//         )}

//         {user.role === 'premium' && (
//           <>
//             <Label>Premium</Label>
//             <Link id="songs" icon="bi-music-note-list">All Songs</Link>
//             <Link id="liked" icon="bi-heart-fill" iconColor="#e74c3c">Liked Songs</Link>
//             <Link id="playlists" icon="bi-collection-play">My Playlists</Link>
//           </>
//         )}

//         {user.role === 'user' && (
//           <>
//             <Label>Library</Label>
//             <Link id="songs" icon="bi-music-note-list">All Songs</Link>
//           </>
//         )}

//       </nav>
//     </div>
//   );
// };

// export default Sidebar;


// import { NavLink } from 'react-router-dom';
// import { useAuth } from './your-auth-context';
// import { useState } from 'react';

// /* ---------- Sidebar Link ---------- */
// const SidebarLink = ({ id, icon, children, iconColor, onClick, isActive }) => (
//   <button
//     onClick={() => onClick(id)}
//     style={{
//       display: 'flex',
//       alignItems: 'center',
//       gap: 12,
//       padding: '10px 12px',
//       borderRadius: 6,
//       color: isActive ? 'white' : '#b3b3b3',
//       background: isActive ? '#282828' : 'transparent',
//       border: 'none',
//       fontSize: '0.9rem',
//       fontWeight: 500,
//       marginBottom: 4,
//       cursor: 'pointer',
//       textAlign: 'left',
//       width: '100%',
//       transition: '0.2s ease'
//     }}
//     onMouseEnter={e => {
//       if (!isActive) {
//         e.currentTarget.style.color = 'white';
//         e.currentTarget.style.background = '#282828';
//       }
//     }}
//     onMouseLeave={e => {
//       if (!isActive) {
//         e.currentTarget.style.color = '#b3b3b3';
//         e.currentTarget.style.background = 'transparent';
//       }
//     }}
//   >
//     <i
//       className={`bi ${icon}`}
//       style={{
//         fontSize: '1.1rem',
//         color: iconColor || 'inherit'
//       }}
//     ></i>
//     {children}
//   </button>
// );

// /* ---------- Sidebar Label ---------- */
// const SidebarLabel = ({ children }) => (
//   <div
//     style={{
//       color: '#535353',
//       fontSize: '0.75rem',
//       padding: '16px 12px 8px',
//       textTransform: 'uppercase',
//       letterSpacing: '1px'
//     }}
//   >
//     {children}
//   </div>
// );

// /* ---------- Sidebar ---------- */
// const Sidebar = ({ onTabChange }) => {
//   const { user } = useAuth();
//   const [activeTab, setActiveTab] = useState('songs');

//   if (!user || !user.role) return null;

//   const handleClick = (id) => {
//     setActiveTab(id);

//     if (onTabChange) {
//       onTabChange(id);
//     } else {
//       const el = document.getElementById(id);
//       if (el) el.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   return (
//     <div
//       style={{
//         width: 240,
//         height: '100vh',
//         background: '#121212',
//         color: 'white',
//         padding: '16px 8px',
//         position: 'fixed',
//         left: 0,
//         top: 0
//       }}
//     >
//       {/* Logo */}
//       <div
//         style={{
//           fontSize: '1.4rem',
//           fontWeight: 'bold',
//           padding: '0 12px 20px'
//         }}
//       >
//         SoundNest
//       </div>

//       {/* Navigation */}
//       <nav>
//         {/* Home */}
//         <NavLink
//           to={`/${user.role}`}
//           style={({ isActive }) => ({
//             display: 'flex',
//             alignItems: 'center',
//             gap: 12,
//             padding: '10px 12px',
//             borderRadius: 6,
//             color: isActive ? 'white' : '#b3b3b3',
//             textDecoration: 'none',
//             marginBottom: 8,
//             background: isActive ? '#282828' : 'transparent'
//           })}
//         >
//           <i className="bi bi-house-fill"></i>
//           Home
//         </NavLink>

//         {/* ADMIN */}
//         {user.role === 'admin' && (
//           <>
//             <SidebarLabel>Admin</SidebarLabel>
//             <SidebarLink
//               id="songs"
//               icon="bi-music-note-list"
//               onClick={handleClick}
//               isActive={activeTab === 'songs'}
//             >
//               All Songs
//             </SidebarLink>
//             <SidebarLink
//               id="users"
//               icon="bi-people-fill"
//               onClick={handleClick}
//               isActive={activeTab === 'users'}
//             >
//               All Users
//             </SidebarLink>
//             <SidebarLink
//               id="upload"
//               icon="bi-cloud-upload"
//               onClick={handleClick}
//               isActive={activeTab === 'upload'}
//             >
//               Add Song
//             </SidebarLink>
//           </>
//         )}

//         {/* ARTIST */}
//         {user.role === 'artist' && (
//           <>
//             <SidebarLabel>Artist</SidebarLabel>
//             <SidebarLink
//               id="songs"
//               icon="bi-music-note-list"
//               onClick={handleClick}
//               isActive={activeTab === 'songs'}
//             >
//               My Songs
//             </SidebarLink>
//             <SidebarLink
//               id="upload"
//               icon="bi-cloud-upload"
//               onClick={handleClick}
//               isActive={activeTab === 'upload'}
//             >
//               Upload Song
//             </SidebarLink>
//           </>
//         )}

//         {/* PREMIUM */}
//         {user.role === 'premium' && (
//           <>
//             <SidebarLabel>Premium</SidebarLabel>
//             <SidebarLink
//               id="songs"
//               icon="bi-music-note-list"
//               onClick={handleClick}
//               isActive={activeTab === 'songs'}
//             >
//               All Songs
//             </SidebarLink>
//             <SidebarLink
//               id="liked"
//               icon="bi-heart-fill"
//               iconColor="#e74c3c"
//               onClick={handleClick}
//               isActive={activeTab === 'liked'}
//             >
//               Liked Songs
//             </SidebarLink>
//             <SidebarLink
//               id="playlists"
//               icon="bi-collection-play"
//               onClick={handleClick}
//               isActive={activeTab === 'playlists'}
//             >
//               My Playlists
//             </SidebarLink>
//           </>
//         )}

//         {/* NORMAL USER */}
//         {user.role === 'user' && (
//           <>
//             <SidebarLabel>Library</SidebarLabel>
//             <SidebarLink
//               id="songs"
//               icon="bi-music-note-list"
//               onClick={handleClick}
//               isActive={activeTab === 'songs'}
//             >
//               All Songs
//             </SidebarLink>
//           </>
//         )}
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ---------- Sidebar Link ---------- */
const SidebarLink = ({ id, icon, children, iconColor, onClick, isActive }) => (
  <button
    onClick={() => onClick(id)}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 12px',
      borderRadius: 6,
      color: isActive ? 'white' : '#b3b3b3',
      background: isActive ? '#282828' : 'transparent',
      border: 'none',
      fontSize: '0.9rem',
      fontWeight: 500,
      marginBottom: 4,
      cursor: 'pointer',
      textAlign: 'left',
      width: '100%',
      transition: '0.2s ease',
    }}
    onMouseEnter={e => {
      if (!isActive) {
        e.currentTarget.style.color = 'white';
        e.currentTarget.style.background = '#282828';
      }
    }}
    onMouseLeave={e => {
      if (!isActive) {
        e.currentTarget.style.color = '#b3b3b3';
        e.currentTarget.style.background = 'transparent';
      }
    }}
  >
    <i className={`bi ${icon}`} style={{ fontSize: '1.1rem', color: iconColor || 'inherit' }}></i>
    {children}
  </button>
);

/* ---------- Sidebar Label ---------- */
const SidebarLabel = ({ children }) => (
  <div style={{
    color: '#535353',
    fontSize: '0.75rem',
    padding: '16px 12px 8px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  }}>
    {children}
  </div>
);

/* ---------- Sidebar ---------- */
const Sidebar = ({ onTabChange }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('songs');

  if (!user || !user.role) return null;

  const handleClick = (id) => {
    setActiveTab(id);
    if (onTabChange) {
      onTabChange(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">SoundNest</div>
      <nav className="sidebar-nav">

        {/* Home */}
        <NavLink
          to={`/${user.role}`}
          className={({ isActive }) => isActive ? 'active' : ''}
        >
          <i className="bi bi-house-fill"></i>
          Home
        </NavLink>

        {/* ADMIN */}
        {user.role === 'admin' && (
          <>
            <SidebarLabel>Admin</SidebarLabel>
            <SidebarLink id="songs" icon="bi-music-note-list" onClick={handleClick} isActive={activeTab === 'songs'}>All Songs</SidebarLink>
            <SidebarLink id="users" icon="bi-people-fill" onClick={handleClick} isActive={activeTab === 'users'}>All Users</SidebarLink>
            <SidebarLink id="upload" icon="bi-cloud-upload" onClick={handleClick} isActive={activeTab === 'upload'}>Add Song</SidebarLink>
            <SidebarLink id="analytics" icon="bi-bar-chart-fill" onClick={handleClick} isActive={activeTab === 'analytics'}>Analytics</SidebarLink>
          </>
        )}

        {/* ARTIST */}
        {user.role === 'artist' && (
          <>
            <SidebarLabel>Artist</SidebarLabel>
            <SidebarLink id="songs" icon="bi-music-note-list" onClick={handleClick} isActive={activeTab === 'songs'}>My Songs</SidebarLink>
            <SidebarLink id="upload" icon="bi-cloud-upload" onClick={handleClick} isActive={activeTab === 'upload'}>Upload Song</SidebarLink>
            <SidebarLink id="edit" icon="bi-pencil-fill" onClick={handleClick} isActive={activeTab === 'edit'}>Edit Song</SidebarLink>
            <SidebarLink id="stats" icon="bi-bar-chart" onClick={handleClick} isActive={activeTab === 'stats'}>Song Stats</SidebarLink>
          </>
        )}

        {/* PREMIUM */}
        {user.role === 'premium' && (
          <>
            <SidebarLabel>Premium</SidebarLabel>
            <SidebarLink id="songs" icon="bi-music-note-list" onClick={handleClick} isActive={activeTab === 'songs'}>All Songs</SidebarLink>
            <SidebarLink id="liked" icon="bi-heart-fill" iconColor="#e74c3c" onClick={handleClick} isActive={activeTab === 'liked'}>Liked Songs</SidebarLink>
            <SidebarLink id="playlists" icon="bi-collection-play" onClick={handleClick} isActive={activeTab === 'playlists'}>My Playlists</SidebarLink>
          </>
        )}

        {/* NORMAL USER */}
        {user.role === 'user' && (
          <>
            <SidebarLabel>Library</SidebarLabel>
            <SidebarLink id="songs" icon="bi-music-note-list" onClick={handleClick} isActive={activeTab === 'songs'}>All Songs</SidebarLink>
          </>
        )}

      </nav>
    </div>
  );
};

export default Sidebar;
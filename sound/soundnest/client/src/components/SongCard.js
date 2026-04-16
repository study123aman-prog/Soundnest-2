

// import React from 'react';
// import { usePlayer } from '../context/PlayerContext';

// const SongCard = ({ song, allSongs = [], onDelete, onLike, onAddToPlaylist, showDelete = false, showLike = false, showAddToPlaylist = false }) => {
//   const { playSong, currentSong, isPlaying } = usePlayer();
//   const isCurrentSong = currentSong?._id === song._id;

//   const gradients = [
//     'linear-gradient(135deg, #1DB954, #0d7334)',
//     'linear-gradient(135deg, #9b59b6, #6c3483)',
//     'linear-gradient(135deg, #e74c3c, #922b21)',
//     'linear-gradient(135deg, #3498db, #1a5276)',
//     'linear-gradient(135deg, #f39c12, #9a6006)',
//     'linear-gradient(135deg, #1abc9c, #0e6655)',
//   ];
//   const gradientIndex = song.title.charCodeAt(0) % gradients.length;

//   return (
//     <div className={`song-card ${isCurrentSong ? 'border border-success' : ''}`} onClick={() => playSong(song, allSongs)}>
//       <div className="song-cover" style={{ background: gradients[gradientIndex] }}>
//         {isCurrentSong && isPlaying
//           ? <i className="bi bi-equalizer-fill" style={{ color: '#1DB954' }}></i>
//           : <i className="bi bi-music-note-beamed" style={{ color: 'white', opacity: 0.8 }}></i>
//         }
//       </div>
//       <div className="play-overlay">
//         <i className={`bi bi-${isCurrentSong && isPlaying ? 'pause-fill' : 'play-fill'}`} style={{ color: 'black', fontSize: '1.2rem' }}></i>
//       </div>
//       <div className="song-title" style={{ color: isCurrentSong ? '#1DB954' : 'white' }}>{song.title}</div>
//       <div className="song-artist">{song.artist}</div>
//       <div className="mt-2">
//         <span className="badge" style={{ background: '#282828', color: '#b3b3b3', fontSize: '0.7rem' }}>{song.genre || 'Pop'}</span>
//         {song.likes > 0 && (
//           <span className="badge ms-1" style={{ background: '#282828', color: '#b3b3b3', fontSize: '0.7rem' }}>
//             <i className="bi bi-heart-fill" style={{ color: '#e74c3c' }}></i> {song.likes}
//           </span>
//         )}
//       </div>
//       {(showDelete || showLike || showAddToPlaylist) && (
//         <div className="mt-2 d-flex gap-1" onClick={e => e.stopPropagation()}>
//           {showLike && (
//             <button className="btn btn-sm" style={{ background: '#3e3e3e', color: '#e74c3c', border: 'none', borderRadius: '20px', padding: '2px 8px' }}
//               onClick={() => onLike && onLike(song._id)} title="Like song">
//               <i className="bi bi-heart-fill"></i>
//             </button>
//           )}
//           {showAddToPlaylist && (
//             <button className="btn btn-sm" style={{ background: '#3e3e3e', color: '#1DB954', border: 'none', borderRadius: '20px', padding: '2px 8px' }}
//               onClick={() => onAddToPlaylist && onAddToPlaylist(song._id)} title="Add to playlist">
//               <i className="bi bi-plus-circle"></i>
//             </button>
//           )}
//           {showDelete && (
//             <button className="btn btn-sm" style={{ background: '#3e3e3e', color: '#e74c3c', border: 'none', borderRadius: '20px', padding: '2px 8px' }}
//               onClick={() => onDelete && onDelete(song._id)} title="Delete song">
//               <i className="bi bi-trash"></i>
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SongCard;

import React from 'react';
import { usePlayer } from '../context/PlayerContext';

const SongCard = ({
  song,
  allSongs = [],
  onDelete,
  onLike,
  onAddToPlaylist,
  showDelete = false,
  showLike = false,
  showAddToPlaylist = false,
  isLiked = false,
}) => {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const isCurrentSong = currentSong?._id === song._id;

  const gradients = [
    'linear-gradient(135deg, #1DB954, #0d7334)',
    'linear-gradient(135deg, #9b59b6, #6c3483)',
    'linear-gradient(135deg, #e74c3c, #922b21)',
    'linear-gradient(135deg, #3498db, #1a5276)',
    'linear-gradient(135deg, #f39c12, #9a6006)',
    'linear-gradient(135deg, #1abc9c, #0e6655)',
  ];
  const gradientIndex = song.title.charCodeAt(0) % gradients.length;

  return (
    <div
      className={`song-card ${isCurrentSong ? 'border border-success' : ''}`}
      onClick={() => playSong(song, allSongs)}
    >
      <div className="song-cover" style={{ background: gradients[gradientIndex] }}>
        {isCurrentSong && isPlaying
          ? <i className="bi bi-equalizer-fill" style={{ color: '#1DB954' }}></i>
          : <i className="bi bi-music-note-beamed" style={{ color: 'white', opacity: 0.8 }}></i>
        }
      </div>
      <div className="play-overlay">
        <i className={`bi bi-${isCurrentSong && isPlaying ? 'pause-fill' : 'play-fill'}`} style={{ color: 'black', fontSize: '1.2rem' }}></i>
      </div>
      <div className="song-title" style={{ color: isCurrentSong ? '#1DB954' : 'white' }}>{song.title}</div>
      <div className="song-artist">{song.artist}</div>
      <div className="mt-2">
        <span className="badge" style={{ background: '#282828', color: '#b3b3b3', fontSize: '0.7rem' }}>{song.genre || 'Pop'}</span>
        {song.likes > 0 && (
          <span className="badge ms-1" style={{ background: '#282828', color: '#b3b3b3', fontSize: '0.7rem' }}>
            <i className="bi bi-heart-fill" style={{ color: '#e74c3c' }}></i> {song.likes}
          </span>
        )}
      </div>
      {(showDelete || showLike || showAddToPlaylist) && (
        <div className="mt-2 d-flex gap-1" onClick={e => e.stopPropagation()}>
          {showLike && (
            <button
              className="btn btn-sm"
              title={isLiked ? 'Unlike song' : 'Like song'}
              style={{
                background: isLiked ? '#4a0e0e' : '#3e3e3e',
                color: '#e74c3c',
                border: isLiked ? '1px solid #e74c3c' : 'none',
                borderRadius: '20px',
                padding: '2px 8px',
                transition: 'all 0.2s',
              }}
              onClick={() => onLike && onLike(song._id)}
            >
              <i className={`bi bi-heart${isLiked ? '-fill' : ''}`}></i>
            </button>
          )}
          {showAddToPlaylist && (
            <button className="btn btn-sm" style={{ background: '#3e3e3e', color: '#1DB954', border: 'none', borderRadius: '20px', padding: '2px 8px' }}
              onClick={() => onAddToPlaylist && onAddToPlaylist(song._id)} title="Add to playlist">
              <i className="bi bi-plus-circle"></i>
            </button>
          )}
          {showDelete && (
            <button className="btn btn-sm" style={{ background: '#3e3e3e', color: '#e74c3c', border: 'none', borderRadius: '20px', padding: '2px 8px' }}
              onClick={() => onDelete && onDelete(song._id)} title="Delete song">
              <i className="bi bi-trash"></i>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SongCard;
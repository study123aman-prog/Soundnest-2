// =============================================
// client/src/context/PlayerContext.js
// MODIFIED: added recently played history tracking
// =============================================

import React, { createContext, useState, useRef, useContext } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong]   = useState(null);
  const [isPlaying, setIsPlaying]       = useState(false);
  const [queue, setQueue]               = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef                        = useRef(null);

  // NEW: recently played - stores last 10 unique songs
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  // NEW: helper to add a song to recently played
  const addToRecentlyPlayed = (song) => {
    setRecentlyPlayed(prev => {
      // Remove duplicate if this song is already in the list
      const filtered = prev.filter(s => s._id !== song._id);
      // Add to front, keep max 10
      return [song, ...filtered].slice(0, 10);
    });
  };

  const playSong = (song, songList = []) => {
    setCurrentSong(song);
    setQueue(songList);
    const idx = songList.findIndex(s => s._id === song._id);
    setCurrentIndex(idx >= 0 ? idx : 0);
    setIsPlaying(true);
    addToRecentlyPlayed(song); // NEW: track history
  };

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const playNext = () => {
    if (queue.length === 0) return;
    const nextIndex = (currentIndex + 1) % queue.length;
    setCurrentIndex(nextIndex);
    setCurrentSong(queue[nextIndex]);
    setIsPlaying(true);
    addToRecentlyPlayed(queue[nextIndex]); // NEW: track history
  };

  const playPrev = () => {
    if (queue.length === 0) return;
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    setCurrentIndex(prevIndex);
    setCurrentSong(queue[prevIndex]);
    setIsPlaying(true);
    addToRecentlyPlayed(queue[prevIndex]); // NEW: track history
  };

  return (
    <PlayerContext.Provider value={{
      currentSong, isPlaying, queue, recentlyPlayed,
      playSong, togglePlay, playNext, playPrev, audioRef
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);

export default PlayerContext;

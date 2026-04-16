import React, { useEffect, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';

const MusicPlayer = () => {
  const { currentSong, isPlaying, togglePlay, playNext, playPrev, audioRef } = usePlayer();
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!currentSong || !audioRef.current) return;
    audioRef.current.src = currentSong.fileUrl;
    audioRef.current.load();
    if (isPlaying) audioRef.current.play();
  }, [currentSong]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(e => console.log('Play failed:', e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const curr = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 0;
    setCurrentTime(curr);
    setDuration(dur);
    setProgress(dur ? (curr / dur) * 100 : 0);
  };

  const handleSeek = (e) => {
    const newProgress = e.target.value;
    const newTime = (newProgress / 100) * (audioRef.current?.duration || 0);
    if (audioRef.current) audioRef.current.currentTime = newTime;
    setProgress(newProgress);
  };

  return (
    <div className="player-bar">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={playNext}
      />

      <div className="player-song-info">
        <div className="player-cover">
          <i className="bi bi-music-note-beamed"></i>
        </div>
        <div>
          {currentSong ? (
            <>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>{currentSong.title}</div>
              <div style={{ fontSize: '0.75rem', color: '#b3b3b3' }}>{currentSong.artist}</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '0.85rem', color: '#b3b3b3' }}>No song selected</div>
              <div style={{ fontSize: '0.75rem', color: '#535353' }}>Pick a song to play</div>
            </>
          )}
        </div>
      </div>

      <div className="player-controls">
        <div className="player-buttons">
          <button className="player-btn"><i className="bi bi-shuffle"></i></button>
          <button className="player-btn" onClick={playPrev}><i className="bi bi-skip-start-fill"></i></button>
          <button className="player-play-btn" onClick={togglePlay}>
            <i className={`bi bi-${isPlaying ? 'pause-fill' : 'play-fill'}`}></i>
          </button>
          <button className="player-btn" onClick={playNext}><i className="bi bi-skip-end-fill"></i></button>
          <button className="player-btn"><i className="bi bi-repeat"></i></button>
        </div>
        <div className="progress-bar-container">
          <span className="time-text">{formatTime(currentTime)}</span>
          <input type="range" min="0" max="100" value={progress} onChange={handleSeek} />
          <span className="time-text">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2" style={{ minWidth: '150px', justifyContent: 'flex-end' }}>
        <i className="bi bi-volume-up" style={{ color: '#b3b3b3' }}></i>
        <input type="range" min="0" max="100" defaultValue="80"
          style={{ width: '80px', accentColor: '#1DB954' }}
          onChange={e => { if (audioRef.current) audioRef.current.volume = e.target.value / 100; }}
        />
      </div>
    </div>
  );
};
export default MusicPlayer;
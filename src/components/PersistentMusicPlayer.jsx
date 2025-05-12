import React from 'react';
import { useMusicPlayer } from './MusicPlayerContext';

const PersistentMusicPlayer = ({ children }) => {
  const {
    tracks,
    currentTrackIndex,
    isPlaying,
    setIsPlaying,
    currentTime,
    duration,
    setCurrentTrackIndex
  } = useMusicPlayer();

  const currentTrack = tracks[currentTrackIndex] || {};

  return (
    <>
      {children}
      {tracks.length > 0 && currentTrack && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#333',
          color: 'white',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{ flex: 1 }}>
            <strong>{currentTrack.name || 'Unknown Track'}</strong>
            <small style={{ marginLeft: '10px' }}>
              {currentTrack.artist || 'Unknown Artist'}
            </small>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button onClick={() => setCurrentTrackIndex((currentTrackIndex - 1 + tracks.length) % tracks.length)}>
              Previous
            </button>
            <button onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button onClick={() => setCurrentTrackIndex((currentTrackIndex + 1) % tracks.length)}>
              Next
            </button>
          </div>
          <div style={{ marginLeft: '10px' }}>
            <small>{Math.floor(currentTime)} / {Math.floor(duration)}</small>
          </div>
        </div>
      )}
    </>
  );
};

export default PersistentMusicPlayer;
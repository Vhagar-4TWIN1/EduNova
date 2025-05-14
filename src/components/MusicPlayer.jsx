import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Button, 
  ListGroup, 
  Spinner, 
  Alert, 
  Form, 
  DropdownButton, 
  Dropdown,
  ProgressBar
} from 'react-bootstrap';
import YouTube from 'react-youtube';
import axios from 'axios';
import './MusicPlayer.css'; // Import the CSS file




const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const MusicPlayer = () => {
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [youtubePlaylists, setYoutubePlaylists] = useState({});
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [offlineTracks, setOfflineTracks] = useState([]);
  const [customPlaylists, setCustomPlaylists] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [downloadProgress, setDownloadProgress] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const audioRef = useRef(null);
  const playerRef = useRef(null);
  const progressInterval = useRef(null);



  useEffect(()=>{
    document.title = "Music"
  },[])
  
  // Helper function to convert data URI to Blob
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  // Handler functions with useCallback
  const handlePlayPause = useCallback(() => {
    if (!tracks.length) return;

    if (!userInteracted) {
      setUserInteracted(true);
      setTimeout(() => setIsPlaying(true), 100);
      return;
    }

    if (tracks[currentTrackIndex]?.isYouTube) {
      if (isPlaying) {
        playerRef.current?.internalPlayer?.pauseVideo();
      } else {
        playerRef.current?.internalPlayer?.playVideo();
      }
      setIsPlaying(prev => !prev);
    } else {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(prev => !prev);
      }
    }
  }, [tracks, currentTrackIndex, isPlaying, userInteracted]);

  const handleNext = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  }, [tracks.length]);

  const handlePrevious = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev === 0 ? tracks.length - 1 : prev - 1));
    setIsPlaying(true);
  }, [tracks.length]);

  const handleTrackSelect = useCallback((index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  }, []);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      clearInterval(progressInterval.current);
      
      // Clean up blob URLs
      offlineTracks.forEach(track => {
        if (track.offlineUrl) {
          URL.revokeObjectURL(track.offlineUrl);
        }
      });
    };
  }, []);

  // Load saved data from localStorage
  useEffect(() => {
    const savedPlaylists = localStorage.getItem('customPlaylists');
    if (savedPlaylists) setCustomPlaylists(JSON.parse(savedPlaylists));

    const savedOfflineTracks = localStorage.getItem('offlineTracks');
    if (savedOfflineTracks) {
      try {
        const tracks = JSON.parse(savedOfflineTracks);
        const updatedTracks = tracks.map(track => ({
          ...track,
          offlineUrl: track.offlineData ? 
            URL.createObjectURL(dataURItoBlob(track.offlineData)) : 
            null
        }));
        setOfflineTracks(updatedTracks.filter(t => t.offlineUrl));
      } catch (e) {
        console.error("Failed to parse offline tracks", e);
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('customPlaylists', JSON.stringify(customPlaylists));
  }, [customPlaylists]);

  useEffect(() => {
    localStorage.setItem('offlineTracks', JSON.stringify(
      offlineTracks.map(t => ({
        ...t,
        offlineUrl: undefined,
        offlineBlob: undefined
      }))
    ));
  }, [offlineTracks]);

  // Detect user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      setUserInteracted(true);
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrevious();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayPause, handleNext, handlePrevious]);


  
  // Load tracks
  useEffect(() => {
    const loadTracks = async () => {
      try {
        const response = await axios.get('https://edunova-back-rqxc.onrender.com/api/music/tracks');
        const validTracks = Array.isArray(response.data)
          ? response.data.map(track => {
              const id = track.id || 
                (track.isYouTube ? `yt_${track.url.split('v=')[1]?.split('&')[0]}` : 
                `local_${track.url.split('/').pop()}`);
              return {
                ...track,
                id,
                url: track.url.startsWith('http') ? track.url : `https://edunova-back-rqxc.onrender.com${track.url}`
              };
            }).filter(track => {
              if (track.isYouTube) return true;
              return track.url && !track.url.includes('undefined');
            })
          : [];
  
        setTracks(validTracks);
  
        const playlistRes = await axios.get('https://edunova-back-rqxc.onrender.com/api/music/youtube/playlists');
        setYoutubePlaylists(playlistRes.data);
      } catch (err) {
        console.error("Failed to load tracks:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    loadTracks();
  }, []);

  useEffect(() => {
    if (!audioRef.current || !tracks.length || !userInteracted) return;

    const currentTrack = tracks[currentTrackIndex];
    if (!currentTrack || currentTrack.isYouTube) return;

    // Check if we have an offline version
    const offlineTrack = offlineTracks.find(t => t.id === currentTrack.id);
    
    setIsAudioLoading(true);

    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsAudioLoading(false);
    };

    const handleCanPlay = () => {
      setIsAudioLoading(false);
      if (isPlaying) {
        audio.play().catch(err => {
          console.error("Play error:", err);
          setError(`Playback error: ${err.message}`);
          setIsPlaying(false);
        });
      }
    };

    const handleError = (e) => {
      console.error("Audio error:", e);
      setIsAudioLoading(false);
      setError("Failed to load audio file");
      setIsPlaying(false);
    };

    if (offlineTrack) {
      audio.src = offlineTrack.offlineUrl;
    } else {
      audio.src = currentTrack.url.startsWith('http') ? 
        currentTrack.url : 
        `https://edunova-back-rqxc.onrender.com${currentTrack.url}`;
    }

    audio.load();

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleNext);
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleNext);
      audio.removeEventListener('play', () => setIsPlaying(true));
      audio.removeEventListener('pause', () => setIsPlaying(false));
      audio.src = '';
    };
  }, [currentTrackIndex, tracks, userInteracted, isPlaying, offlineTracks]);

  // Update progress for audio tracks
  useEffect(() => {
    if (!tracks.length || !userInteracted) return;
    const currentTrack = tracks[currentTrackIndex];
    if (!currentTrack || currentTrack.isYouTube) return;

    const updateProgress = () => {
      if (!audioRef.current || isSeeking) return;
      setCurrentTime(audioRef.current.currentTime);
    };

    progressInterval.current = setInterval(updateProgress, 1000);
    return () => clearInterval(progressInterval.current);
  }, [currentTrackIndex, tracks, userInteracted, isSeeking]);

  // Media Session API integration
  useEffect(() => {
    if ('mediaSession' in navigator && tracks[currentTrackIndex]) {
      const track = tracks[currentTrackIndex];
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.name || 'Unknown Track',
        artist: 'Unknown Artist',
        artwork: track.thumbnail ? [
          { src: track.thumbnail, sizes: '96x96', type: 'image/jpeg' }
        ] : []
      });

      navigator.mediaSession.setActionHandler('play', handlePlayPause);
      navigator.mediaSession.setActionHandler('pause', handlePlayPause);
      navigator.mediaSession.setActionHandler('previoustrack', handlePrevious);
      navigator.mediaSession.setActionHandler('nexttrack', handleNext);
    }
  }, [currentTrackIndex, tracks]);

  const downloadTrack = async (track) => {
    try {
      setDownloadProgress(prev => ({
        ...prev,
        [track.id]: { progress: 0, status: 'downloading' }
      }));

      let response;
      
      if (track.isYouTube) {
        response = await axios.post(
          `https://edunova-back-rqxc.onrender.com/api/music/youtube/save/${track.id}`,
          {},
          {
            onDownloadProgress: (progressEvent) => {
              const percentCompleted = progressEvent.total ? 
                Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
              setDownloadProgress(prev => ({
                ...prev,
                [track.id]: { progress: percentCompleted, status: 'downloading' }
              }));
            },
            timeout: 120000 // 2 minute timeout
          }
        );

        // Refresh tracks after download
        const tracksRes = await axios.get('https://edunova-back-rqxc.onrender.com/api/music/tracks');
        setTracks(tracksRes.data);
      } else {
        // For local files, use the full URL
        const downloadUrl = track.url.startsWith('http') ? 
          track.url : 
          `https://edunova-back-rqxc.onrender.com${track.url}`;
        
        response = await axios.get(downloadUrl, {
          responseType: 'blob',
          onDownloadProgress: (progressEvent) => {
            const percentCompleted = progressEvent.total ? 
              Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
            setDownloadProgress(prev => ({
              ...prev,
              [track.id]: { progress: percentCompleted, status: 'downloading' }
            }));
          },
          timeout: 60000
        });

        // Create offline version
        const blob = new Blob([response.data]);
        const objectUrl = URL.createObjectURL(blob);

        const reader = new FileReader();
        reader.onload = () => {
          const offlineTrack = {
            ...track,
            offlineUrl: objectUrl,
            offlineData: reader.result,
            isOffline: true
          };
          setOfflineTracks(prev => [...prev.filter(t => t.id !== track.id), offlineTrack]);
        };
        reader.readAsDataURL(blob);
      }

      setDownloadProgress(prev => ({
        ...prev,
        [track.id]: { progress: 100, status: 'completed' }
      }));

    } catch (err) {
      console.error("Download error:", err);
      setError(err.response?.data?.error || err.message || "Download failed");
      setDownloadProgress(prev => ({
        ...prev,
        [track.id]: { progress: 0, status: 'error', error: err.message }
      }));
    }
  };

  const removeOfflineTrack = (trackId) => {
    const track = offlineTracks.find(t => t.id === trackId);
    if (track && track.offlineUrl) {
      URL.revokeObjectURL(track.offlineUrl);
    }
    setOfflineTracks(prev => prev.filter(t => t.id !== trackId));
  };

  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return;
    
    const newPlaylist = {
      id: Date.now().toString(),
      name: newPlaylistName,
      tracks: []
    };
    
    setCustomPlaylists(prev => [...prev, newPlaylist]);
    setNewPlaylistName('');
  };

  const addToCustomPlaylist = (playlistId, track) => {
    setCustomPlaylists(prev => 
      prev.map(playlist => 
        playlist.id === playlistId 
          ? { ...playlist, tracks: [...playlist.tracks, track] } 
          : playlist
      )
    );
  };

  const loadPlaylist = (playlist) => {
    setTracks(playlist.tracks);
    setCurrentPlaylist(playlist);
    setCurrentTrackIndex(0);
    setIsPlaying(false);
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);

    if (tracks[currentTrackIndex]?.isYouTube) {
      if (playerRef.current?.internalPlayer) {
        playerRef.current.internalPlayer.seekTo(seekTime, true);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.currentTime = seekTime;
      }
    }
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekEnd = () => {
    setIsSeeking(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setError(null);
    try {
      const response = await axios.get('https://edunova-back-rqxc.onrender.com/api/music/youtube/search', {
        params: { query: searchQuery },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setSearchResults(response.data);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search YouTube");
    } finally {
      setIsSearching(false);
    }
  };

  const addToPlaylist = (track) => {
    setTracks(prev => [...prev, track]);
    setSearchResults([]);
    setSearchQuery('');
  };

  if (loading) return (
    <div className={`d-flex flex-column justify-content-center align-items-center ${darkMode ? 'bg-dark text-light' : ''}`} style={{ height: 'calc(100vh - 120px)' }}>
      <div className="spinner-grow text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3">Loading your music...</p>
    </div>
  );

  const currentTrack = tracks[currentTrackIndex] || {};
  const showProgress = !isAudioLoading && duration > 0;

  return (
    <div className={`music-player-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* Dark mode toggle */}
      <Button 
        variant="outline-secondary" 
        onClick={() => setDarkMode(!darkMode)}
        className="position-fixed top-0 end-0 m-3"
        style={{ zIndex: 1000 }}
      >
        {darkMode ? <i className="bi bi-sun"></i> : <i className="bi bi-moon"></i>}
      </Button>

      {/* Left sidebar - fixed width */}
      <div className="sidebar">
        {/* Search Section */}
        <div className="search-section">
          <Form.Group className="mb-3">
            <Form.Label>Search YouTube Music</Form.Label>
            <div className="d-flex">
              <Form.Control
                id="search-input"
                type="text"
                placeholder="Enter song name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className={darkMode ? 'bg-dark text-light' : ''}
              />
              <Button 
                variant="primary" 
                onClick={handleSearch} 
                disabled={isSearching}
                className="ms-2"
              >
                {isSearching ? <Spinner animation="border" size="sm" /> : 'Search'}
              </Button>
            </div>
          </Form.Group>

          {searchResults.length > 0 && (
            <div className="search-results-container">
              <ListGroup>
                {searchResults.map((track, idx) => (
                  <ListGroup.Item 
                    key={idx}
                    className={`d-flex justify-content-between align-items-center py-2 ${darkMode ? 'bg-dark text-light' : ''}`}
                  >
                    <div className="d-flex align-items-center">
                      <img 
                        src={track.thumbnail} 
                        alt={track.name} 
                        width="50" 
                        height="50"
                        className="me-3 rounded"
                        style={{ objectFit: 'cover' }}
                      />
                      <div>
                        <div className="fw-bold">{track.name}</div>
                        <small className="text-muted">YouTube • {track.duration || 'Unknown duration'}</small>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline-success"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToPlaylist(track);
                      }}
                    >
                      <i className="bi bi-plus"></i> Add
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}
        </div>

        {/* Custom Playlists Section */}
        <div className="custom-playlists">
          <h5>Custom Playlists</h5>
          <div className="d-flex mb-3">
            <Form.Control
              type="text"
              placeholder="New playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className={`me-2 ${darkMode ? 'bg-dark text-light' : ''}`}
            />
            <Button variant="success" onClick={createPlaylist}>
              Create
            </Button>
          </div>

          {customPlaylists.length > 0 ? (
            <ListGroup>
              {customPlaylists.map(playlist => (
                <ListGroup.Item 
                  key={playlist.id}
                  action
                  active={currentPlaylist?.id === playlist.id}
                  onClick={() => loadPlaylist(playlist)}
                  className={`d-flex justify-content-between align-items-center ${darkMode ? 'bg-dark text-light' : ''}`}
                >
                  {playlist.name}
                  <span className="badge bg-secondary">{playlist.tracks.length} tracks</span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <div className="empty-state text-center py-3">
              <i className="bi bi-music-note-list" style={{ fontSize: '2rem', color: '#6c757d' }}></i>
              <p className="text-muted mt-2">No playlists yet</p>
            </div>
          )}
        </div>

        {/* Offline Tracks Section */}
        <div className="offline-section">
          <h5>Offline Tracks</h5>
          {offlineTracks.length === 0 ? (
            <div className="empty-state text-center py-3">
              <i className="bi bi-download" style={{ fontSize: '2rem', color: '#6c757d' }}></i>
              <p className="text-muted mt-2">No offline tracks</p>
            </div>
          ) : (
            <ListGroup>
              {offlineTracks.map((track, index) => (
                <ListGroup.Item 
                  key={index}
                  action
                  onClick={() => {
                    const trackIndex = tracks.findIndex(t => t.id === track.id);
                    if (trackIndex >= 0) {
                      handleTrackSelect(trackIndex);
                    }
                  }}
                  className={`track-item ${darkMode ? 'bg-dark text-light' : ''}`}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{track.name}</span>
                    <Button 
                      size="sm" 
                      variant="danger" 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeOfflineTrack(track.id);
                      }}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>
      </div>

      {/* Main content - flexible width */}
      <div className="main-content">
        {/* Now Playing Section */}
        <div className={`now-playing ${darkMode ? 'dark-mode' : ''}`}>
          <div className="d-flex align-items-center mb-3">
            {currentTrack.thumbnail && (
              <img 
                src={currentTrack.thumbnail} 
                alt={currentTrack.name} 
                width="80" 
                height="80"
                className="me-3 rounded"
                style={{ objectFit: 'cover' }}
              />
            )}
            <div>
              <h4 className="mb-0">
                {currentTrack.name || "No track selected"}
                {currentTrack.isYouTube && (
                  <span className="badge bg-danger ms-2">YouTube</span>
                )}
                {offlineTracks.some(t => t.id === currentTrack.id) && (
                  <span className="badge bg-success ms-2">Offline</span>
                )}
              </h4>
              <small className="text-muted">
                {currentTrack.artist || 'Unknown artist'} • {formatTime(duration)}
              </small>
            </div>
          </div>

          {isAudioLoading && (
            <div className="text-center my-2">
              <Spinner animation="border" />
              <p>Loading track...</p>
            </div>
          )}

          {/* YouTube Player with proper responsive container */}
          {!currentTrack.isYouTube ? null : (
            <div className="youtube-player-container">
              <YouTube
                videoId={currentTrack.id}
                ref={playerRef}
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: {
                    autoplay: isPlaying ? 1 : 0,
                  },
                }}
                onReady={(e) => {
                  if (isPlaying) e.target.playVideo();
                  setDuration(e.target.getDuration());
                }}
                onStateChange={(e) => {
                  if (e.data === 0) handleNext();
                }}
              />
            </div>
          )}

          {/* Player Controls */}
          <div className="player-controls">
            <div className="d-flex align-items-center mb-2">
              <Button 
                variant="link" 
                onClick={handlePrevious}
                disabled={tracks.length === 0}
                className="control-button"
              >
                <i className="bi bi-skip-start-fill"></i>
              </Button>
              <Button 
                variant="primary" 
                onClick={handlePlayPause}
                disabled={tracks.length === 0}
                className="play-pause-button"
              >
                {isPlaying ? <i className="bi bi-pause-fill"></i> : <i className="bi bi-play-fill"></i>}
              </Button>
              <Button 
                variant="link" 
                onClick={handleNext}
                disabled={tracks.length === 0}
                className="control-button"
              >
                <i className="bi bi-skip-end-fill"></i>
              </Button>
            </div>
            
            {showProgress && (
              <div className="progress-container">
                <div className="d-flex justify-content-between mb-1">
                  <small className="text-muted">{formatTime(currentTime)}</small>
                  <small className="text-muted">{formatTime(duration)}</small>
                </div>
                <input
                  type="range"
                  className="progress-range"
                  min={0}
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  onMouseDown={handleSeekStart}
                  onMouseUp={handleSeekEnd}
                />
              </div>
            )}
          </div>
        </div>

        {/* Current Playlist Section */}
        <div className="playlist-section">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Current Playlist</h5>
            <small className="text-muted">{tracks.length} tracks</small>
          </div>
          
          {tracks.length === 0 ? (
            <div className="empty-state text-center py-5">
              <i className="bi bi-music-note-list" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
              <h5 className="mt-3">No tracks found</h5>
              <p className="text-muted">Add some tracks to get started</p>
              <Button variant="outline-primary" onClick={() => document.getElementById('search-input').focus()}>
                Search for music
              </Button>
            </div>
          ) : (
            <ListGroup>
              {tracks.map((track, index) => {
                const isDownloading = downloadProgress[track.id]?.status === 'downloading';
                const downloadProgressValue = downloadProgress[track.id]?.progress || 0;
                const isDownloaded = offlineTracks.some(t => t.id === track.id);

                return (
                  <ListGroup.Item 
                    key={index}
                    active={index === currentTrackIndex}
                    action
                    onClick={() => handleTrackSelect(index)}
                    className={`d-flex justify-content-between align-items-center py-3 ${darkMode ? 'bg-dark text-light' : ''}`}
                    style={{
                      borderLeft: index === currentTrackIndex ? '4px solid #0d6efd' : '4px solid transparent'
                    }}
                  >
                    <div className="d-flex align-items-center" style={{ flex: 1 }}>
                      {track.thumbnail && (
                        <img 
                          src={track.thumbnail} 
                          alt={track.name} 
                          width="40" 
                          height="40"
                          className="me-3 rounded" 
                          style={{ objectFit: 'cover' }}
                        />
                      )}
                      <div>
                        <div className={`fw-bold ${index === currentTrackIndex ? 'text-primary' : ''}`}>
                          {track.name || `Track ${index + 1}`}
                        </div>
                        <small className="text-muted">
                          {track.artist || 'Unknown artist'} • {track.duration || formatTime(duration)}
                        </small>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      {track.isYouTube && (
                        <small className="text-muted me-2">YouTube</small>
                      )}
                      {isDownloading ? (
                        <div className="download-progress-container">
                          <ProgressBar 
                            now={downloadProgressValue} 
                            label={`${downloadProgressValue}%`} 
                          />
                        </div>
                      ) : (
                        <Button 
                          size="sm" 
                          variant={isDownloaded ? "success" : "outline-primary"}
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadTrack(track);
                          }}
                          disabled={isDownloading || (isDownloaded && !track.isYouTube)}
                          className="me-2"
                        >
                          {isDownloaded && !track.isYouTube ? "Downloaded" : "Download"}
                        </Button>
                      )}
                      {customPlaylists.length > 0 && (
                        <DropdownButton
                          size="sm"
                          variant="outline-secondary"
                          title="+ Playlist"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {customPlaylists.map(playlist => (
                            <Dropdown.Item 
                              key={playlist.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCustomPlaylist(playlist.id, track);
                              }}
                            >
                              {playlist.name}
                            </Dropdown.Item>
                          ))}
                        </DropdownButton>
                      )}
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
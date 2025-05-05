import React, { useState, useEffect, useRef } from 'react';
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
import '../assets/css/MusicPlayer.css';



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

  const audioRef = useRef(null);
  const playerRef = useRef(null);
  const progressInterval = useRef(null);

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

  // Load tracks
  useEffect(() => {
    const loadTracks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/music/tracks');
        const validTracks = Array.isArray(response.data)
          ? response.data.map(track => {
              // Ensure each track has a proper ID
// Replace the current ID generation logic with:
          const id = track.id || 
          (track.isYouTube ? `yt_${track.url.split('v=')[1]?.split('&')[0]}` : 
          `local_${track.url.split('/').pop()}`);
              return {
                ...track,
                id,
                url: track.url.startsWith('http') ? track.url : `http://localhost:3000${track.url}`
              };
            }).filter(track => {
              if (track.isYouTube) return true;
              return track.url && !track.url.includes('undefined');
            })
          : [];
  
        setTracks(validTracks);
  
        const playlistRes = await axios.get('http://localhost:3000/api/music/youtube/playlists');
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

  // Audio handler
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
        `http://localhost:3000${currentTrack.url}`;
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
        // Handle YouTube download
        response = await axios.post(
          `http://localhost:3000/api/music/youtube/save/${track.id}`,
          {},
          {
            onDownloadProgress: (progressEvent) => {
              const percentCompleted = progressEvent.total ? 
                Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
              setDownloadProgress(prev => ({
                ...prev,
                [track.id]: { 
                  progress: percentCompleted, 
                  status: 'downloading' 
                }
              }));
            }
          }
        );
  
        // If it's an existing track, just add to UI
        if (response.data.message === 'Track already exists') {
          setTracks(prev => [...prev, response.data.track]);
          setDownloadProgress(prev => ({
            ...prev,
            [track.id]: { progress: 100, status: 'completed' }
          }));
          return;
        }
      } else {
        // Handle local file download
        response = await axios.get(
          `http://localhost:3000/api/music/download/${track.id}`,
          {
            responseType: 'blob',
            onDownloadProgress: (progressEvent) => {
              const percentCompleted = progressEvent.total ? 
                Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
              setDownloadProgress(prev => ({
                ...prev,
                [track.id]: { 
                  progress: percentCompleted, 
                  status: 'downloading' 
                }
              }));
            }
          }
        );
  
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
  
          setOfflineTracks(prev => {
            const filtered = prev.filter(t => t.id !== track.id);
            return [...filtered, offlineTrack];
          });
        };
        reader.readAsDataURL(blob);
      }
  
      setDownloadProgress(prev => ({
        ...prev,
        [track.id]: { progress: 100, status: 'completed' }
      }));
  
      setTimeout(() => {
        setDownloadProgress(prev => {
          const newProgress = {...prev};
          delete newProgress[track.id];
          return newProgress;
        });
      }, 3000);
  
    } catch (err) {
      console.error("Download error:", err);
      const errorMessage = err.response?.data?.error || 
                          err.message || 
                          "Failed to download track";
      setError(errorMessage);
      setDownloadProgress(prev => ({
        ...prev,
        [track.id]: { progress: 0, status: 'error', error: errorMessage }
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

  const handlePlayPause = () => {
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
  };

  const handleTrackSelect = (index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? tracks.length - 1 : prev - 1));
    setIsPlaying(true);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3000/api/music/youtube/search', {
        params: { query: searchQuery }
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
    <div className="d-flex justify-content-center align-items-center" style={{ height: 'calc(100vh - 120px)' }}>
      <Spinner animation="border" />
    </div>
  );

  const currentTrack = tracks[currentTrackIndex] || {};
  const showProgress = !isAudioLoading && duration > 0;

  return (
    <div className="music-player-container" style={{
      minHeight: 'calc(100vh - 120px)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {/* Alert Messages */}
      {!userInteracted && (
        <Alert variant="info" className="mb-3">
          Click the play button to start playback
        </Alert>
      )}

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-3">
          {error}
        </Alert>
      )}

      {/* Search Section */}
      <div className="search-section mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Search YouTube Music</Form.Label>
          <div className="d-flex">
            <Form.Control
              type="text"
              placeholder="Enter song name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button 
              variant="primary" 
              onClick={handleSearch} 
              disabled={isSearching}
              className="ms-2"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </Form.Group>

        {searchResults.length > 0 && (
          <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
            <ListGroup>
              {searchResults.map((track, idx) => (
                <ListGroup.Item 
                  key={idx} 
                  className="d-flex justify-content-between align-items-center"
                  action
                  onClick={() => {
                    const existingIndex = tracks.findIndex(t => t.id === track.id);
                    if (existingIndex >= 0) {
                      handleTrackSelect(existingIndex);
                    } else {
                      addToPlaylist(track);
                      handleTrackSelect(tracks.length);
                    }
                  }}
                >
                  <div className="d-flex align-items-center">
                    <img src={track.thumbnail} alt={track.name} width="50" className="me-2" />
                    <span>{track.name}</span>
                  </div>
                  <Button size="sm" variant="success" onClick={(e) => {
                    e.stopPropagation();
                    addToPlaylist(track);
                  }}>
                    Add
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}
      </div>

      {/* Now Playing Section (Sticky) */}
      <div className="now-playing mb-4 p-3 bg-light rounded" style={{
        position: 'sticky',
        top: 0,
        backgroundColor: '#f8f9fa',
        zIndex: 100,
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <h4>
          {currentTrack.name || "No track selected"}
          {currentTrack.isYouTube && (
            <span className="badge bg-danger ms-2">YouTube</span>
          )}
          {offlineTracks.some(t => t.id === currentTrack.id) && (
            <span className="badge bg-success ms-2">Offline</span>
          )}
        </h4>

        {isAudioLoading && (
          <div className="text-center my-2">
            <Spinner animation="border" />
          </div>
        )}

        {!currentTrack.isYouTube ? null : (
          <YouTube
            videoId={currentTrack.id}
            ref={playerRef}
            opts={{
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
        )}

        {showProgress && (
          <div className="my-3">
            <input
              type="range"
              className="form-range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              onMouseDown={handleSeekStart}
              onMouseUp={handleSeekEnd}
            />
            <div className="d-flex justify-content-between">
              <small>{formatTime(currentTime)}</small>
              <small>{formatTime(duration)}</small>
            </div>
          </div>
        )}

        <div className="d-flex justify-content-center mt-3">
          <Button variant="secondary" className="me-2" onClick={handlePrevious}>Previous</Button>
          <Button variant="primary" onClick={handlePlayPause}>
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button variant="secondary" className="ms-2" onClick={handleNext}>Next</Button>
        </div>
      </div>

      {/* Custom Playlists Section */}
      <div className="custom-playlists mt-4" style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
        <h5>Custom Playlists</h5>
        <div className="d-flex mb-3">
          <Form.Control
            type="text"
            placeholder="New playlist name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            className="me-2"
          />
          <Button variant="success" onClick={createPlaylist}>
            Create
          </Button>
        </div>

        {customPlaylists.length > 0 && (
          <ListGroup>
            {customPlaylists.map(playlist => (
              <ListGroup.Item 
                key={playlist.id}
                action
                active={currentPlaylist?.id === playlist.id}
                onClick={() => loadPlaylist(playlist)}
                className="d-flex justify-content-between align-items-center"
              >
                {playlist.name}
                <span className="badge bg-secondary">{playlist.tracks.length} tracks</span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>

      {/* Offline Tracks Section */}
      <div className="offline-section mt-4" style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
        <h5>Offline Tracks</h5>
        {offlineTracks.length === 0 ? (
          <p>No tracks downloaded for offline use</p>
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
                    Remove
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>

      {/* Current Playlist Section */}
      <div className="playlist-section mt-4" style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
        <h5>Current Playlist</h5>
        {tracks.length === 0 ? (
          <p>No tracks in playlist</p>
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
                  className="d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center" style={{ flex: 1 }}>
                    {track.thumbnail && (
                      <img 
                        src={track.thumbnail} 
                        alt={track.name} 
                        width="40" 
                        className="me-2 rounded" 
                      />
                    )}
                    <span>{track.name || `Track ${index + 1}`}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    {track.isYouTube && (
                      <small className="text-muted me-2">YouTube</small>
                    )}
                    {isDownloading ? (
                      <div style={{ width: '100px' }}>
                        <ProgressBar 
                          now={downloadProgressValue} 
                          label={`${downloadProgressValue}%`} 
                          style={{ height: '20px' }}
                        />
                      </div>
                    ) : (
                      <Button 
                      size="sm" 
                      variant={isDownloaded ? "success" : "outline-primary"}
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadTrack(track); // Remove the condition here
                      }}
                      disabled={isDownloading || (isDownloaded && !track.isYouTube)} // Modified condition
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
  );
};

export default MusicPlayer;



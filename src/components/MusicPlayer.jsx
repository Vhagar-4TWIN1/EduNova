import React, { useState, useEffect, useRef } from 'react';
import { Button, ListGroup, Spinner, Alert, Form, ProgressBar } from 'react-bootstrap';
import YouTube from 'react-youtube';
import axios from 'axios';

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
    };
  }, []);

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
          ? response.data.filter(track => {
              if (track.isYouTube) return true;
              const url = track.url.startsWith('http') ? track.url : `http://localhost:3000${track.url}`;
              return url && !url.includes('undefined');
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

    const audio = audioRef.current;
    let audioUrl = currentTrack.url;

    if (!audioUrl.startsWith('http') && !audioUrl.startsWith('/')) {
      console.error('Invalid audio URL format:', audioUrl);
      return;
    }

    if (!audioUrl.startsWith('http')) {
      audioUrl = `http://localhost:3000${audioUrl}`;
    }

    setIsAudioLoading(true);

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

    audio.src = audioUrl;
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
  }, [currentTrackIndex, tracks, userInteracted, isPlaying]);

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

  if (loading) return <Spinner animation="border" />;

  const currentTrack = tracks[currentTrackIndex] || {};
  const showProgress = !isAudioLoading && duration > 0;

  return (
    <div className="music-player p-3">
      {!userInteracted && (
        <Alert variant="info">
          Click the play button to start playback
        </Alert>
      )}

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

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
        )}
      </div>

      <div className="now-playing mb-4 p-3 bg-light rounded">
        <h4>
          {currentTrack.name || "No track selected"}
          {currentTrack.isYouTube && (
            <span className="badge bg-danger ms-2">YouTube</span>
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
              if (e.data === 0) handleNext(); // Ended
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
    </div>
  );
};

export default MusicPlayer;

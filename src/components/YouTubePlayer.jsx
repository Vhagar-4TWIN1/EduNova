import React, { useEffect } from 'react';
import YouTube from 'react-youtube';

const YouTubePlayer = ({ videoId, isPlaying, onEnd, onPlay, onPause }) => {
  const playerRef = React.useRef(null);

  useEffect(() => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.internalPlayer.playVideo();
    } else {
      playerRef.current.internalPlayer.pauseVideo();
    }
  }, [isPlaying]);

  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: isPlaying ? 1 : 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1
    }
  };

  return (
    <div style={{ position: 'absolute', opacity: 0 }}>
      <YouTube
        ref={playerRef}
        videoId={videoId}
        opts={opts}
        onEnd={onEnd}
        onPlay={onPlay}
        onPause={onPause}
        onError={(e) => console.error("YouTube Player Error:", e)}

      />
    </div>
  );
};

export default YouTubePlayer;


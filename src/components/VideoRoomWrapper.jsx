import React from 'react';
import { useParams } from 'react-router-dom';
import VideoRoom from './VideoRoom';

const VideoRoomWrapper = () => {
  const { roomId, userId } = useParams();
  
  if (!roomId || !userId) {
    return <div>Invalid room or user ID</div>;
  }

  return <VideoRoom roomId={roomId} userId={userId} />;
};

export default VideoRoomWrapper;
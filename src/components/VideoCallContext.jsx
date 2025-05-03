import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const VideoCallContext = createContext();

export const VideoCallProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io('http://localhost:3000', {
      withCredentials: true,
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      autoConnect: true
    });

    const onConnect = () => {
      setIsConnected(true);
      console.log('Socket connected:', socketInstance.id);
    };

    const onDisconnect = () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    };

    const onConnectError = (err) => {
      console.error('Connection error:', err);
    };

    socketInstance.on('connect', onConnect);
    socketInstance.on('disconnect', onDisconnect);
    socketInstance.on('connect_error', onConnectError);

    setSocket(socketInstance);

    return () => {
      socketInstance.off('connect', onConnect);
      socketInstance.off('disconnect', onDisconnect);
      socketInstance.off('connect_error', onConnectError);
      socketInstance.disconnect();
    };
  }, []);

  return (
    <VideoCallContext.Provider value={{ socket, isConnected }}>
      {children}
    </VideoCallContext.Provider>
  );
};

export const useVideoCall = () => useContext(VideoCallContext);
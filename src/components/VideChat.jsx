import React, { useRef, useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function VideoChat() {
  const [roomId, setRoomId] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [isCreator, setIsCreator] = useState(false);
  const [pc, setPc] = useState(null);

  const localRef = useRef(null);
  const remoteRef = useRef(null);

  const iceConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  useEffect(() => {
    socket.on('room-created', code => {
      setSecretCode(code);
      setRoomId(code);
      setIsCreator(true);
    });
    socket.on('joined-room', code => setRoomId(code));
    socket.on('user-joined', async () => {
      if (isCreator) await makeOffer();
    });
    socket.on('offer', async offer => {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const ans = await pc.createAnswer();
      await pc.setLocalDescription(ans);
      socket.emit('answer', { roomId, answer: ans });
    });
    socket.on('answer', async answer => {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });
    socket.on('candidate', async candidate => {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    });
    return () => socket.removeAllListeners();
  }, [pc, isCreator, roomId]);

  const initConnection = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localRef.current.srcObject = stream;
    const peer = new RTCPeerConnection(iceConfig);
    stream.getTracks().forEach(t => peer.addTrack(t, stream));
    peer.onicecandidate = e => {
      if (e.candidate) socket.emit('candidate', { roomId, candidate: e.candidate });
    };
    peer.ontrack = e => {
      if (remoteRef.current.srcObject !== e.streams[0]) {
        remoteRef.current.srcObject = e.streams[0];
      }
    };
    setPc(peer);
  };

  const createRoom = async () => {
    await initConnection();
    socket.emit('create-room');
  };

  const joinRoom = async () => {
    if (!secretCode) return alert('Enter a room code.');
    await initConnection();
    socket.emit('join-room', secretCode);
  };

  return (
    <div className="container py-4">
      <div className="video-chat-container">
        <h2 className="text-center mb-4">2-Person Video Chat</h2>

        {!roomId ? (
          <div className="controls d-flex flex-column flex-md-row gap-2 align-items-stretch align-items-md-center justify-content-center mb-3">
            <button className="btn btn-primary" onClick={createRoom}>Create Room</button>
            <input
              className="form-control"
              value={secretCode}
              onChange={e => setSecretCode(e.target.value)}
              placeholder="Room code"
            />
            <button className="btn btn-success" onClick={joinRoom}>Join Room</button>
          </div>
        ) : (
          <p className="text-center mb-3">
            Your room: <strong>{roomId}</strong>
          </p>
        )}

        <div className="row g-3 justify-content-center">
          <div className="col-12 col-md-6">
            <div className="video-wrapper position-relative bg-dark rounded overflow-hidden">
              <video
                ref={localRef}
                autoPlay
                muted
                playsInline
                className="video-element w-100"
              />
              <span className="label">You</span>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="video-wrapper position-relative bg-dark rounded overflow-hidden">
              <video
                ref={remoteRef}
                autoPlay
                playsInline
                className="video-element w-100"
              />
              <span className="label">Peer</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .video-wrapper {
          aspect-ratio: 16 / 9;
        }
        .label {
          position: absolute;
          bottom: 8px;
          left: 8px;
          background: rgba(0,0,0,0.6);
          color: #fff;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.8rem;
        }
        @media (max-width: 768px) {
          .video-wrapper {
            aspect-ratio: 4 / 3;
          }
        }
      `}</style>
    </div>
  );
}

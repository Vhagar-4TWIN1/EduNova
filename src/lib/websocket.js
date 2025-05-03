let socketInstance = null;
const messageHandlers = {};

export function setupWebSocket(onReconnect) {
  if (socketInstance) {
    socketInstance.close();
    socketInstance = null;
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host     = window.location.hostname;
  const port     = import.meta.env.DEV ? '3000' : window.location.port;
  const wsUrl    = `${protocol}//${host}:${port}/ws`;
  console.log('▶️ Connecting WebSocket to', wsUrl);

  const socket = new WebSocket(wsUrl);
  socketInstance = socket;

  let pingInterval = null;

  socket.onopen = async () => {
    console.log('✅ WebSocket connected');
    pingInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        sendMessage('ping');
      }
    }, 5000);

    if (typeof onReconnect === 'function') {
      try {
        await onReconnect();
      } catch (err) {
        console.error('⏰ onReconnect handler failed:', err);
      }
    }
  };

  socket.onmessage = (event) => {
    let data;
    try {
      data = JSON.parse(event.data);
    } catch (err) {
      console.error('❌ WS parse error:', err);
      return;
    }
    const handlers = messageHandlers[data.type] || [];
    handlers.forEach(handler => {
      try {
        handler(data.payload);
      } catch (e) {
        console.error(`❌ WS handler for "${data.type}" threw:`, e);
      }
    });
  };

  socket.onerror = (err) => {
    console.error('⚠️ WebSocket error:', err);
  };

  socket.onclose = () => {
    console.log('❌ WebSocket closed');
    clearInterval(pingInterval);
  };

  // return cleanup function
  return () => {
    clearInterval(pingInterval);
    socket.close();
    socketInstance = null;
  };
}

export function sendMessage(type, payload) {
  if (!socketInstance || socketInstance.readyState !== WebSocket.OPEN) {
    console.error('⚠️ WebSocket not connected; cannot send', type, payload);
    return false;
  }
  const msg = { type, payload };
  socketInstance.send(JSON.stringify(msg));
  return true;
}

export function onMessage(type, handler) {
  if (!messageHandlers[type]) messageHandlers[type] = [];
  messageHandlers[type].push(handler);
  return () => {
    messageHandlers[type] = messageHandlers[type].filter(h => h !== handler);
    if (messageHandlers[type].length === 0) {
      delete messageHandlers[type];
    }
  };
}

export function getConnectionStatus() {
  return !!(socketInstance && socketInstance.readyState === WebSocket.OPEN);
}

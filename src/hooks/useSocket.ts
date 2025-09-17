// useWebSocket.ts

import { useEffect, useRef, useState } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const useWebSocket = (url: string) => {
  const socketRef = useRef<W3CWebSocket | null>(null);
  const [isConnected, setConnected] = useState<boolean>(false);
  console.log(url)
  useEffect(() => {
    const socket = new W3CWebSocket(url);
    
    socket.onopen = () => {
      console.log("WebSocket Client Connected");
      setConnected(true);
    };

    socket.onerror = (error) => {
      console.error("Connection Error: ", error);
    };

    socket.onclose = () => {
      console.log("WebSocket Connection Closed");
      setConnected(false);
    };

    socket.onmessage = (e) => {
      console.log("Received: " + e.data);
    };

    socketRef.current = socket;

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [url]);

  const send = (message: string) => {
    if (
      socketRef.current &&
      socketRef.current.readyState === socketRef.current.OPEN
    ) {
      socketRef.current.send(message);
    } else {
      console.error("WebSocket connection not established.");
    }
  };

  return { isConnected, send };
};

export default useWebSocket;
import { useEffect, useRef } from 'react';

export interface WebSocketMessage {
  connectionId?: string;
  text?: string;
}

interface UseWebSocketProps {
  url: string;
  onMessage: (data: WebSocketMessage) => void;
}

const useWebSocket = ({ url, onMessage }: UseWebSocketProps) => {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;
    console.log("Attempting to connect to WebSocket...");

    ws.onopen = () => {
      console.log("WebSocket connection established");
      // Delay to ensure client listeners are set before requesting connectionId.
      setTimeout(() => {
        ws.send(JSON.stringify({ action: "getConnectionId" }));
      }, 1000); // Adjust delay as needed
    };

    ws.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        onMessage(data);
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    ws.onclose = (event) => console.log("WebSocket connection closed", event);
    ws.onerror = (err) => console.error("WebSocket error:", err);

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, [url, onMessage]);

  return wsRef;
};

export default useWebSocket;

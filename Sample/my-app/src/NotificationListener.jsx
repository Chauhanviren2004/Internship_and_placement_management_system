import { useEffect } from "react";
import toast from "react-hot-toast";
import { getStoredAuth } from "./auth";

const NotificationListener = () => {
  useEffect(() => {
    const auth = getStoredAuth();
    if (!auth || !auth.user || !auth.user.id) return;

    // Use WS or WSS depending on whether we're on HTTP or HTTPS, but locally it's WS
    // Fallback to localhost if window.location isn't enough, but Vite proxies usually handle this.
    // For simplicity, we hardcode the backend URL base since the API base is similar.
    const baseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
    const wsUrl = baseUrl.replace(/^http/, "ws") + "/ws/notifications/" + auth.user.id;

    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.message) {
          toast.success(data.message, {
            duration: 6000,
            position: "top-right",
          });
        }
      } catch (err) {
        console.error("Failed to parse websocket message", err);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return null; // This component doesn't render anything
};

export default NotificationListener;

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// This should ideally come from env, hardcoding for local dev as requested
const WS_URL = "http://localhost:8080";

export const useSocket = (slug: string): Socket | null => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!slug) return;

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found for socket auth");
            return;
        }

        // Initialize Socket
        const socketInstance = io(WS_URL, {
            auth: { token },
            query: { roomId: slug },
            transports: ["websocket"], // Force websocket for better perf
        });

        socketInstance.on("connect", () => {
            console.log("Socket Connected:", socketInstance.id);
        });

        socketInstance.on("connect_error", (err) => {
            console.error("Socket Connection Error:", err);
        });

        setSocket(socketInstance);

        // Cleanup on unmount
        return () => {
            socketInstance.disconnect();
        };
    }, [slug]);

    return socket;
};

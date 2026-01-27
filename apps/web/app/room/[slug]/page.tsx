"use client";

import React, { useEffect, useState } from "react";
import { Chat } from "../../../Components/ChatComponent/Chat";
import { Draw } from "../../../Components/DrawComponent/Canvas";
import { Score } from "../../../Components/Score/Score";
import { styles, responsiveRoomCSS } from "./romStyle";
import { useParams } from "next/navigation";
import { getRoom } from "../../../ApiServices/api";
import { useSocket } from "../../../Hooks/useSocket"; // Imported Hook
import toast from "react-hot-toast"; // Imported Toast

interface Player {
    id: string;
    username: string; // Backend sends username
    name: string;     // Score component expects 'name' (required)
    avatarId: number;
    score: number;
}

interface Message {
    id: string;
    name: string;
    message: string;
    avatarId: number;
}

interface Draw {
    id: string;
    name: string;
    avatarId: number;
}


export default function RoomPageUI() {
    const params = useParams();
    const slug = params.slug as string;
    const [room, setRoom] = useState<any>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                setIsLoading(true);
                const data = await getRoom(slug);
                setRoom(data);
            } catch (e: any) {
                console.error(e);
                // Show user-friendly error with toast
                if (e.message?.includes("not found")) {
                    toast.error("Room not found. Please check the room code and try again.");
                    // Redirect to home after a delay
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 2000);
                } else {
                    toast.error("Failed to load room. Please try again later.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        const userStr = localStorage.getItem("user Details");
        if (userStr && userStr !== "undefined") {
            try {
                setCurrentUser(JSON.parse(userStr));
            } catch (e) {
                console.error("Failed to parse user details", e);
            }
        }

        fetchRoom();
    }, [slug]);


    if (isLoading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                fontSize: "1.5rem",
                color: "#fff"
            }}>
                Loading room...
            </div>
        );
    }

    if (!room) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                fontSize: "1.5rem",
                color: "#fff"
            }}>
                Room not found
            </div>
        );
    }

    return (
        <div className="game-container">
            <style>{responsiveRoomCSS}</style>

            {/* DRAW AREA */}
            <div className="draw-area" style={styles.glass}>
                <div style={styles.headerBar}>
                    <div style={styles.infoText}>Time: 45s</div>
                    <div style={styles.wordDisplay}>_ _ _ _ _</div>
                    <div style={styles.infoText}>{room?.status === "WAITING" ? "Waiting for players..." : "Game Started!"}</div>
                </div>

                <div style={{ flex: 1 }}>
                    <Draw
                        roomId={room?.id}
                        isAdmin={room?.adminId === currentUser?.id}
                        status={room?.status}
                    />
                </div>
            </div>

            {/* SIDEBAR */}
            <div className="sidebar-area">
                {/* SCORE */}
                <div className="score-panel" style={styles.glass}>
                    <div style={{ height: "100%", width: "100%" }}>
                        <Score />
                    </div>
                </div>

                {/* CHAT */}
                <div className="chat-panel" style={styles.glass}>
                    <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                        <Chat />
                    </div>
                </div>
            </div>
        </div>
    );
}

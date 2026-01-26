"use client";

import React, { useEffect, useState } from "react";
import { Chat } from "../../../Components/ChatComponent/Chat";
import { Draw } from "../../../Components/DrawComponent/Canvas";
import { Score } from "../../../Components/Score/Score";
import { styles, responsiveRoomCSS } from "./romStyle";
import { useParams } from "next/navigation";
import { getRoomId } from "../../../ApiServices/api";
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

    // State
    const [players, setPlayers] = useState<Player[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);

    // WS Hook
    const socket = useSocket(slug);

    // 1. Initial Fetch (HTTP Fallback)
    useEffect(() => {
        const initRoom = async () => {
            try {
                if (!slug) return;
                const res = await getRoomId(slug);
                if (res && res.users) {
                    const mappedUsers = res.users.map((u: any) => ({
                        id: u.id,
                        username: u.username,
                        name: u.username,
                        avatarId: u.avatarId,
                        score: 0
                    }));
                    setPlayers(mappedUsers);
                    toast.success("Joined Room");
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load room data");
            }
        };
        initRoom();
    }, [slug]);

    // 2. Real-time Listeners (WS)
    useEffect(() => {
        if (!socket) return;

        // User Joined -> Update Leaderboard
        socket.on("user-joined", (updatedPlayers: any[]) => {
            const mapped = updatedPlayers.map(p => ({
                id: p.id,
                username: p.name,
                name: p.name,
                avatarId: p.avatarId,
                score: p.score
            }));
            setPlayers(mapped);

            // Optional: System Chat Toast?
            // toast(`${mapped[mapped.length-1].name} joined!`);
        });

        // User Left -> Update Leaderboard
        socket.on("user-left", (updatedPlayers: any[]) => {
            const mapped = updatedPlayers.map(p => ({
                id: p.id,
                username: p.name,
                name: p.name,
                avatarId: p.avatarId,
                score: p.score
            }));
            setPlayers(mapped);
        });

        // Chat Message -> Update Chat & Handle System Messages
        socket.on("chat-message", (msg: any) => {
            // msg: { name, message }
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                name: msg.name,
                message: msg.message,
                avatarId: msg.name === 'System' ? 0 : 99 // Placeholder if avatar not sent in chat
            }]);
        });

        return () => {
            socket.off("user-joined");
            socket.off("user-left");
            socket.off("chat-message");
        };
    }, [socket]);

    return (
        <div className="game-container">
            <style>{responsiveRoomCSS}</style>

            {/* DRAW AREA */}
            <div className="draw-area" style={styles.glass}>
                <div style={styles.headerBar}>
                    <div style={styles.infoText}>Time: 45s</div>
                    <div style={styles.wordDisplay}>_ _ _ _ _</div>
                    <div style={styles.infoText}>Waiting for players...</div>
                </div>

                <div style={{ flex: 1 }}>
                    <Draw isDrawer={false} />
                </div>
            </div>

            {/* SIDEBAR */}
            <div className="sidebar-area">
                {/* SCORE */}
                <div className="score-panel" style={styles.glass}>
                    <div style={{ height: "100%", width: "100%" }}>
                        <Score players={players} />
                    </div>
                </div>

                {/* CHAT */}
                <div className="chat-panel" style={styles.glass}>
                    <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                        <Chat messages={messages} />
                    </div>
                </div>
            </div>
        </div>
    );
}

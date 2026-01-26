"use client";

import React from "react";
import { Chat } from "../../../Components/ChatComponent/Chat";
import { Draw } from "../../../Components/DrawComponent/Canvas";
import { Score } from "../../../Components/Score/Score";
import { styles, responsiveRoomCSS } from "./romStyle";




const mockPlayers = [
    { id: "1", name: "Zoro", score: 120, avatarId: 1 },
    { id: "2", name: "Luffy", score: 95, avatarId: 2 },
    { id: "3", name: "Nami", score: 80, avatarId: 3 },
    { id: "4", name: "Sanji", score: 70, avatarId: 4 },
    { id: "5", name: "Usopp", score: 65, avatarId: 5 },
    { id: "6", name: "Robin", score: 110, avatarId: 6 },
    { id: "7", name: "Chopper", score: 50, avatarId: 7 },
    { id: "8", name: "Franky", score: 85, avatarId: 8 },
];

const mockMessages = [
    { name: "Zoro", message: "Is it a sword?", avatarId: 1 },
    { name: "Luffy", message: "Looks tasty 😄", avatarId: 2 },
    { name: "Nami", message: "No way, it’s not food", avatarId: 3 },
    { name: "Sanji", message: "Anything beautiful? 👀", avatarId: 4 },
    { name: "Usopp", message: "I’ve seen this before!", avatarId: 5 },
    { name: "Robin", message: "Interesting shape...", avatarId: 6 },
    { name: "Chopper", message: "Is it scary? 😨", avatarId: 7 },
    { name: "Franky", message: "SUUUPER cool drawing!", avatarId: 8 },
    { name: "Brook", message: "Yohohoho! A skull?", avatarId: 9 },
    { name: "Zoro", message: "Nah, that’s not it.", avatarId: 1 },
    { name: "Luffy", message: "I still think it’s food 😂", avatarId: 2 },
    { name: "Nami", message: "Stop guessing food, Luffy!", avatarId: 3 },
];


export default function RoomPageUI() {
    return (
        <div className="game-container">
            <style>{responsiveRoomCSS}</style>

            {/* DRAW AREA */}
            <div className="draw-area" style={styles.glass}>
                <div style={styles.headerBar}>
                    <div style={styles.infoText}>Time: 45s</div>
                    <div style={styles.wordDisplay}>_ _ _ _ _</div>
                    <div style={styles.infoText}>.... is drawing</div>
                </div>

                <div style={{ flex: 1 }}>
                    <Draw isDrawer />
                </div>
            </div>

            {/* SIDEBAR */}
            <div className="sidebar-area">
                {/* SCORE */}
                <div className="score-panel" style={styles.glass}>
                    <div style={{ height: "100%", width: "100%" }}>
                        <Score players={mockPlayers} />
                    </div>
                </div>

                {/* CHAT */}
                <div className="chat-panel" style={styles.glass}>
                    <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                        <Chat messages={mockMessages} />
                    </div>
                </div>
            </div>
        </div>
    );
}

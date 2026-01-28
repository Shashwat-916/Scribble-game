"use client";

import React from "react";
import { Chat } from "../../../Components/ChatComponent/Chat";
import { Draw } from "../../../Components/DrawComponent/Canvas";
import { Score } from "../../../Components/Score/Score";
import { styles, responsiveRoomCSS } from "./romStyle";



interface RoomData {
    id: string;
    slug: string;
    status: string;
    adminId: string;
    createdAt: string;
    players: Array<{
        id: string;
        userId: string;
        score: number;
        user: {
            id: string;
            username: string;
            avatarId: number;
        };
    }>;
}




export default function RoomPageUI() {
  return (
    <div className="game-container">
      <style>{responsiveRoomCSS}</style>

      {/* DRAW AREA */}
      <div className="draw-area" style={styles.glass}>
        <div style={styles.headerBar}>
          <div style={styles.infoText}>Time: 45s</div>
          <div style={styles.wordDisplay}>_ _ _ _ _</div>
          <div style={styles.infoText}>Players: 4</div>
        </div>

        <div style={{ flex: 1 }}>
          <Draw isAdmin />
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="sidebar-area">
        {/* SCORE */}
        <div className="score-panel" style={styles.glass}>
          <Score />
        </div>

        {/* CHAT */}
        <div className="chat-panel" style={styles.glass}>
          <Chat />
        </div>
      </div>
    </div>
  );
}

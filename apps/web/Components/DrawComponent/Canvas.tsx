"use client";
import React from "react";
import {
  Pencil,
  RectangleHorizontal as RectangleHorizontalIcon,
  Circle,
  Minus,
  Play,
} from "lucide-react";
import { styles } from "./Canvasstyle";
import { startGame } from "../../ApiServices/api";
import toast from "react-hot-toast";

interface DrawProps {
  roomId?: string;
  isAdmin?: boolean;
  status?: string;
}

export const Draw = ({ roomId, isAdmin, status }: DrawProps) => {
  const handleStartGame = async () => {
    if (!roomId) return;
    try {
      await startGame(roomId);
      toast.success("Game started!");
      window.location.reload(); // Refresh to update status or handle via state if preferred
    } catch (e: any) {
      toast.error(e.message || "Failed to start game");
    }
  };

  return (
    <div style={styles.container}>
      {/* Topbar (UI only) */}
      <div style={styles.topbar}>
        <button style={styles.iconButton}>
          <Pencil size={20} />
        </button>
        <button style={styles.iconButton}>
          <RectangleHorizontalIcon size={20} />
        </button>
        <button style={styles.iconButton}>
          <Circle size={20} />
        </button>
        <button style={styles.iconButton}>
          <Minus size={20} />
        </button>

        {isAdmin && status === "WAITING" && (
          <button
            onClick={handleStartGame}
            style={{ ...styles.iconButton, marginLeft: 'auto', backgroundColor: '#4CAF50', color: 'white', display: 'flex', alignItems: 'center', gap: '5px', padding: '0 15px', borderRadius: '5px' }}
          >
            <Play size={16} /> Start Game
          </button>
        )}
      </div>

      {/* Canvas */}
      <div style={styles.canvasContainer}>
        <canvas style={styles.canvas} />
        <div style={styles.overlayLabel}>
          {status === "WAITING" ? "Waiting for players..." : "View Only"}
        </div>
      </div>
    </div>
  );
};

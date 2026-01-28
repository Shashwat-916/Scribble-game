"use client";
import React from "react";
import {
  Pencil,
  RectangleHorizontal as RectangleHorizontalIcon,
  Circle,
  Play,
} from "lucide-react";
import { styles } from "./Canvasstyle";

interface DrawProps {
  isAdmin?: boolean;
}

export const Draw = ({ isAdmin }: DrawProps) => {
  return (
    <div style={styles.container}>
      {/* Topbar */}
      <div style={styles.topbar}>
        <button style={styles.iconButton}>
          <Pencil size={20} color="grey" />
        </button>

        <button style={styles.iconButton}>
          <RectangleHorizontalIcon size={20} color="grey" />
        </button>

        <button style={styles.iconButton}>
          <Circle size={20} color="grey" />
        </button>

        {isAdmin && (
          <button
            style={{ ...styles.startButton, cursor: "default", zIndex: 100 }}
            disabled
          >
            <Play size={16} /> Start Game
          </button>
        )}

        {/* Word display placeholder */}
        <div
          style={{
            marginLeft: "auto",
            color: "white",
            fontWeight: "bold",
            fontSize: "18px",
            letterSpacing: "4px",
          }}
        >
          _ _ _ _
        </div>
      </div>

      {/* Canvas Area */}
      <div style={styles.canvasContainer}>
        <canvas width={800} height={600} style={styles.canvas} />

        {/* Overlay — choosing */}
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Pick a word to draw</h3>
            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button style={styles.wordButton}>Apple</button>
              <button style={styles.wordButton}>House</button>
              <button style={styles.wordButton}>Car</button>
            </div>
          </div>
        </div>

        {/* Overlay — finished (example) */}
        {false && (
          <div style={styles.overlay}>
            <div style={styles.modal}>
              <h2>Game Finished!</h2>

              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>1. Player One</span>
                  <span>120 pts</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>2. Player Two</span>
                  <span>80 pts</span>
                </div>
              </div>

              <button
                style={{ ...styles.wordButton, marginTop: "20px" }}
                disabled
              >
                Back to Lobby
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

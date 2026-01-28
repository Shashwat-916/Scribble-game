import React from "react";
import { User, Star } from "lucide-react";

export const Score = () => {
  return (
    <div className="score-grid">
      {/* Player card */}
      <div className="score-card">
        <div className="score-avatar" style={{ overflow: "hidden" }}>
          <User size={16} color="rgba(255,255,255,0.5)" />
        </div>

        <div className="score-info">
          <div
            className="score-name"
            style={{ display: "flex", alignItems: "center", gap: "4px" }}
          >
            Player One
            <Star size={14} fill="#ffd700" color="#ffd700" />
          </div>
        </div>

        <div className="score-point">120</div>
      </div>

      <div className="score-card">
        <div className="score-avatar" style={{ overflow: "hidden" }}>
          <User size={16} color="rgba(255,255,255,0.5)" />
        </div>

        <div className="score-info">
          <div className="score-name">Player Two</div>
        </div>

        <div className="score-point">80</div>
      </div>

      <div className="score-card">
        <div className="score-avatar" style={{ overflow: "hidden" }}>
          <User size={16} color="rgba(255,255,255,0.5)" />
        </div>

        <div className="score-info">
          <div className="score-name">Player Three</div>
        </div>

        <div className="score-point">40</div>
      </div>
    </div>
  );
};

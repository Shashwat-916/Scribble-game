import React from "react";
import { User } from "lucide-react";
import { AVATARS } from "../../Constants/avatar";

interface Player {
  id: string;
  name: string;
  score: number;
  avatarId: number;
}

interface ScoreProps {
  players: Player[];
}



export const Score = () => {
  return (
    <div className="score-grid">
      {/* Static score card */}
      <div className="score-card">
        <div className="score-avatar">
          <User size={16} color="rgba(255,255,255,0.5)" />
        </div>

        <div className="score-info">
          <div className="score-name">Player Name</div>
        </div>

        <div className="score-point">0</div>
      </div>

      {/* Duplicate for layout preview */}
      <div className="score-card">
        <div className="score-avatar">
          <User size={16} color="rgba(255,255,255,0.5)" />
        </div>

        <div className="score-info">
          <div className="score-name">Another Player</div>
        </div>

        <div className="score-point">0</div>
      </div>
    </div>
  );
};
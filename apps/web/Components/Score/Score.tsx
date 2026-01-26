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



export const Score = ({ players }: ScoreProps) => {
  return (
    <div className="score-grid">
      {players.map((player) => {
        const avatar = AVATARS.find(a => a.id === player.avatarId);

        return (
          <div key={player.id} className="score-card">
            <div className="score-avatar">
              {avatar ? (
                <img src={avatar.src} alt={player.name} />
              ) : (
                <User size={16} color="rgba(255,255,255,0.5)" />
              )}
            </div>

            <div className="score-info">
              <div className="score-name">{player.name}</div>
            </div>

            <div className="score-point">{player.score}</div>
          </div>
        );
      })}
    </div>
  );
};

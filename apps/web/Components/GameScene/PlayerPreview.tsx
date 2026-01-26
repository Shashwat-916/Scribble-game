import{ AVATARS }from "../../Constants/avatar";
import { styles } from "../../Styles/app.style";

interface Props {
  avatarId: number;
  name: string;
  activeTab: 'create' | 'join';
  countdown: number | null;
}

export const PlayerPreview = ({ avatarId, name, activeTab, countdown }: Props) => {
  const selectedAvatar = AVATARS.find((a: any) => a.id === avatarId);

  return (
    <div className="right-section" style={styles.rightSection}>
      <div style={styles.illustration}>
        <div style={styles.floatingBadge}>
          {activeTab === 'create' ? 'Host' : 'Guest'}
        </div>

        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {selectedAvatar && (
            <img
              src={selectedAvatar.src} alt="Selected"
              style={{
                width: "120px", height: "120px", objectFit: "contain", marginBottom: "16px",
                filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.5))", transform: "rotate(-5deg)"
              }}
            />
          )}
          <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>{name || "Player"}</div>
          <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
            {countdown !== null ? "Launching..." : activeTab === 'create' ? "Creating Lobby" : "Joining Lobby"}
          </div>
        </div>
        
        {/* Background Blob */}
        <div style={{
          position: "absolute", bottom: "-20px", left: "-20px", width: "80px", height: "80px", borderRadius: "50%",
          background: activeTab === 'create' ? "linear-gradient(45deg, #ec4899, #8b5cf6)" : "linear-gradient(45deg, #3b82f6, #10b981)",
          filter: "blur(40px)", zIndex: -1
        }} />
      </div>
    </div>
  );
};
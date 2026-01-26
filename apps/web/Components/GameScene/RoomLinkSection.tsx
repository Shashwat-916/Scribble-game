import { Copy, Check } from "lucide-react";
import { styles } from "../../Styles/app.style";

interface Props {
  slug: string | null;
  onCopy: () => void;
  isCopied: boolean;
}

export const RoomLinkSection = ({ slug, onCopy, isCopied }: Props) => {
  if (!slug) {
      // Show placeholder state
      return (
        <div>
            <label style={styles.label}>Invite Link Preview</label>
            <div style={{ ...styles.linkBox, borderColor: "rgba(255,255,255,0.05)" }}>
                <span style={{ ...styles.linkText, color: "#94a3b8" }}>room...</span>
                <button style={styles.copyBtn} disabled><Copy size={16} /></button>
            </div>
        </div>
      )
  }

  return (
    <div>
      <label style={styles.label}>Invite Link Ready</label>
      <div style={{
        ...styles.linkBox,
        borderColor: "#4ade80",
        backgroundColor: "rgba(74, 222, 128, 0.1)"
      }}>
        <span style={{ ...styles.linkText, color: "#fff" }}>{slug}</span>
        <button style={styles.copyBtn} onClick={onCopy}>
          {isCopied ? <Check size={16} color="#4ade80" /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
};
import { Plus, LogIn } from "lucide-react";

interface Props {
  activeTab: 'create' | 'join';
  onChange: (tab: 'create' | 'join') => void;
  disabled: boolean;
}

export const LobbyTabs = ({ activeTab, onChange, disabled }: Props) => {
  const containerStyle = {
    display: "flex", backgroundColor: "rgba(255,255,255,0.05)", padding: "4px",
    borderRadius: "12px", marginBottom: "24px", border: "1px solid rgba(255,255,255,0.1)",
    opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' as any
  };

  const btnStyle = (isActive: boolean) => ({
    flex: 1, padding: "10px", borderRadius: "10px", border: "none", cursor: "pointer",
    fontWeight: 600, fontSize: "0.9rem", transition: "all 0.2s ease",
    backgroundColor: isActive ? "rgba(255,255,255,0.15)" : "transparent",
    color: isActive ? "#fff" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
  });

  return (
    <div style={containerStyle}>
      <button onClick={() => onChange('create')} style={btnStyle(activeTab === 'create')}>
        <Plus size={16} /> Create
      </button>
      <button onClick={() => onChange('join')} style={btnStyle(activeTab === 'join')}>
        <LogIn size={16} /> Join
      </button>
    </div>
  );
};
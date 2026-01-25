import {AVATARS }from "../../Constants/avatar";
import { getAvatarStyles, avatarStyles } from "./avatarStyle";

interface AvatarGridProps {
  value: number;
  onChange: (id: number) => void;
}

const AvatarGrid = ({ value, onChange }: AvatarGridProps) => {
  return (
    <div>
      <div style={avatarStyles.grid}>
        {AVATARS.map((avatar) => {
          const isActive = value === avatar.id;
          const styles = getAvatarStyles(isActive);

          return (
            <button
              key={avatar.id}
              onClick={() => onChange(avatar.id)}
              style={{
                ...avatarStyles.avatarBtn,
                ...(isActive ? avatarStyles.avatarBtnActive : {}),
                ...styles.button,
              }}
            >
              <img src={avatar.src} alt={avatar.alt} style={styles.image} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AvatarGrid;

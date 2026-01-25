import { CSSProperties } from "react";

export const avatarStyles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
  } as CSSProperties,

  avatarBtn: {
    aspectRatio: "1 / 1",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.03)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    position: "relative",
  } as CSSProperties,

  avatarBtnActive: {
    border: "1px solid #8b5cf6",
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    boxShadow: "0 0 0 2px rgba(139, 92, 246, 0.3)",
  } as CSSProperties,
};

export const getAvatarStyles = (isActive: boolean) => ({
  button: {
    padding: "2px",
    overflow: "hidden",
  } as CSSProperties,

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "12px",
    opacity: isActive ? 1 : 0.6,
    transition: "opacity 0.2s ease",
  } as CSSProperties,
});

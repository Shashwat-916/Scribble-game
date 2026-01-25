
// 1. Responsive CSS (Layout Switcher)
// This handles the "stacked vs side-by-side" layout logic
export const responsiveCSS = `
  .glass-card-container {
    display: flex;
    flex-direction: column;
    max-width: 350px; /* Mobile Default */
  }

  /* Desktop / Tablet (md and up) */
  @media (min-width: 768px) {
    .glass-card-container {
      flex-direction: row;
      max-width: 900px; /* Expand for side-by-side */
    }
    
    .left-section {
      width: 50%;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .right-section {
      width: 50%;
    }
  }
`;

// 2. The Styles Object (Dark Glass Theme)
export const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#000000", // Deep Black Background
    backgroundImage: `
      radial-gradient(circle at 10% 20%, rgba(120, 50, 255, 0.15) 0%, transparent 40%),
      radial-gradient(circle at 90% 80%, rgba(50, 150, 255, 0.15) 0%, transparent 40%)
    `, // Subtle glow effects
    fontFamily: "'Inter', sans-serif",
    color: "#ffffff",
  },
  card: {
    backgroundColor: "rgba(20, 20, 20, 0.6)", // Dark translucent base
    backdropFilter: "blur(20px)", // The Glass Effect
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.1)", // Subtle border
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", // Deep shadow
    overflow: "hidden",
    position: "relative",
  },
  // --- Left Side (Form) ---
  leftSection: {
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    gap: "32px",
  },
  header: {
    marginBottom: "8px",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 800,
    background: "linear-gradient(to right, #fff, #94a3b8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "#94a3b8", // Muted slate text
    lineHeight: "1.5",
  },
  label: {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: "12px",
  },
  // // Avatar Grid
  // grid: {
  //   display: "grid",
  //   gridTemplateColumns: "repeat(4, 1fr)",
  //   gap: "12px",
  // },
  // avatarBtn: {
  //   aspectRatio: "1/1",
  //   borderRadius: "16px",
  //   border: "1px solid rgba(255,255,255,0.1)",
  //   backgroundColor: "rgba(255,255,255,0.03)",
  //   display: "flex",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   cursor: "pointer",
  //   transition: "all 0.2s ease",
  //   position: "relative",
  // },
  // avatarBtnActive: {
  //   borderColor: "#8b5cf6", // Violet border
  //   backgroundColor: "rgba(139, 92, 246, 0.1)", // Violet tint
  //   boxShadow: "0 0 0 2px rgba(139, 92, 246, 0.3)",
  // },

  // Input Field
  inputGroup: {
    position: "relative",
  },
  input: {
    width: "100%",
    padding: "16px 20px",
    paddingLeft: "48px", // Space for icon
    fontSize: "1rem",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    backgroundColor: "rgba(0,0,0,0.3)", // Darker input bg
    color: "#fff",
    outline: "none",
    transition: "border-color 0.2s",
  },
  inputIcon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#64748b",
  },

  // Invite Link Box
  linkBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    borderRadius: "12px",
    backgroundColor: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  linkText: {
    flex: 1,
    fontFamily: "monospace",
    fontSize: "0.85rem",
    color: "#94a3b8",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  copyBtn: {
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
  },

  // Main CTA
  mainButton: {
    marginTop: "auto",
    width: "100%",
    padding: "18px",
    borderRadius: "14px",
    border: "none",
    // Gradient matching the glass vibe
    background: "linear-gradient(135deg, #6366f1, #a855f7)",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    boxShadow: "0 10px 30px -10px rgba(168, 85, 247, 0.5)",
    transition: "transform 0.1s",
  },

  // --- Right Side (Visual) ---
  rightSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    position: "relative",
    background: "radial-gradient(circle at center, rgba(124, 58, 237, 0.05) 0%, transparent 70%)",
  },
  illustration: {
    width: "100%",
    maxWidth: "280px",
    aspectRatio: "1/1",
    borderRadius: "24px",
    background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))",
    border: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    transform: "rotate(-2deg)",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
  },
  floatingBadge: {
    position: "absolute",
    top: "20px",
    right: "20px",
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    color: "#34d399",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: 600,
    border: "1px solid rgba(16, 185, 129, 0.2)",
  },
 
  
};



import React from "react";

// -----------------------------------------------------------------------------
// RESPONSIVE CSS
// -----------------------------------------------------------------------------
export const responsiveRoomCSS = `
  .game-container {
    display: flex;
    flex-direction: column;
    height: 100%; /* Match parent */
    width: 100%;  /* Match parent instead of viewport */
    gap: 16px;
    padding: 16px;
    background-color: #000;
    color: #fff;
    overflow-y: auto; /* Allow scroll on mobile */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
  }
  
  /* Hide scrollbar for Chrome/Safari/Opera */
  .game-container::-webkit-scrollbar,
  .score-grid::-webkit-scrollbar,
  .sidebar-area::-webkit-scrollbar,
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .score-grid, .sidebar-area, .no-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .draw-area {
    width: 100%;
    height: 50vh; /* Takes up half screen on mobile */
    min-height: 350px;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }

  /* Sidebar Area */
  .sidebar-area {
    width: 100%;
    display: flex;
    flex-direction: row; 
    gap: 8px;
    flex-shrink: 0;
    height: 40vh; /* Fixed height to enforce scroll */
    min-height: 250px;
  }

  /* Panels inside sidebar */
  .score-panel {
    width: 35%;
    height: 100%; /* Fill sidebar */
    flex-shrink: 0;
  }
  
  .chat-panel {
    flex: 1;
    width: auto; 
    height: 100%;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
  }

  /* Responsive Score Grid (Inner) */
  .score-grid {
    width: 100%;
    height: 100%; /* Back to filling container */
    padding: 8px; /* Revert padding */
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(8, 1fr);
    gap: 8px;
    overflow-y: auto;
  }

  /* Score Card Styles */
  .score-card {
    /* Removed flex properties */
    min-width: 0; /* Align with grid */
    display: flex;
    align-items: center;
    gap: 4px; 
    padding: 8px;
    border-radius: 12px;
    background-color: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
  }

  .score-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
    background-color: rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .score-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .score-info {
    flex: 1;
    min-width: 0;
  }

  .score-name {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .score-point {
    font-size: 14px;
    font-weight: bold;
    color: #34d399;
  }

  /* Desktop / Tablet Landscape */
  @media (min-width: 1024px) {
    .game-container {
      flex-direction: row;
      overflow: hidden; /* Revert overflow */
    }

    .draw-area {
      width: 75%;  /* Increased by 15% */
      height: 100%;
      flex: none;
    }

    .sidebar-area {
      width: 25%; /* Adjusted for Draw Area increase */
      height: 100%;
      min-height: 0;
      flex: none;
      padding-bottom: 0;
      flex-direction: column; 
      gap: 16px;
    }

    .score-panel {
      width: 100%;
      height: 25%; /* Reduced by 15% (40 -> 25) */
      flex: none; 
    }

    .chat-panel {
      width: 100%;
      height: auto;
      flex: 1; 
    }

    /* Desktop Grid Override */
    .score-grid {
      grid-template-columns: 1fr 1fr; 
      grid-template-rows: repeat(4, 1fr);
      padding: 12px; /* Add breathing room */
      gap: 12px;     /* Increase gap */
    }

    /* Desktop Score Card Overrides */
    .score-card {
      padding: 8px; /* Restore some padding for premium feel */
      gap: 8px;
      border-radius: 12px; /* Rounded consistent with mobile */
    }
    
    .score-avatar {
      width: 24px; /* Smaller avatar */
      height: 24px;
    }
    
    .score-name {
      font-size: 12px; /* Smaller text */
    }
    
    .score-point {
      font-size: 12px;
    }
  }
`;

// -----------------------------------------------------------------------------
// INLINE STYLES (Skin / Theme)
// -----------------------------------------------------------------------------
export const styles = {
    glass: {
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "24px",
        overflow: "hidden",
        position: "relative" as const,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    },
    headerBar: {
        padding: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
    },
    wordDisplay: {
        fontSize: "24px",
        fontWeight: "bold",
        letterSpacing: "0.2em",
    },
    infoText: {
        fontSize: "12px",
        color: "rgba(255,255,255,0.5)",
        textTransform: "uppercase" as const,
        fontWeight: "bold",
    },
    sectionLabel: {
        position: "absolute" as const,
        top: "8px",
        left: "16px",
        fontSize: "12px",
        fontWeight: "bold",
        letterSpacing: "0.1em",
        color: "rgba(255,255,255,0.7)",
        pointerEvents: "none" as const,
    },
};

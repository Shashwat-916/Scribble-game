"use client";
import React from "react";
import { Trash2, Eraser } from "lucide-react";

interface DrawProps {
    isDrawer?: boolean;
}


const styles = {
    container: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column" as const,
        gap: "8px",
    },
    toolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        padding: "8px",
        borderRadius: "8px",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
    },
    colorGroup: {
        display: "flex",
        gap: "8px",
    },
    colorButton: (bgColor: string) => ({
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        border: "2px solid transparent",
        backgroundColor: bgColor,
    }),
    controlsGroup: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
    },
    slider: {
        width: "96px",
        accentColor: "#6366f1",
    },
    iconBtn: {
        background: "none",
        border: "none",
        color: "rgba(255, 255, 255, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    canvasContainer: {
        flex: 1,
        backgroundColor: "#000000",
        borderRadius: "8px",
        overflow: "hidden",
        position: "relative" as const,
        border: "1px solid rgba(255, 255, 255, 0.1)",
    },
    canvas: {
        width: "100%",
        height: "100%",
        display: "block",
    },
    overlayLabel: {
        position: "absolute" as const,
        top: "8px",
        right: "8px",
        fontSize: "12px",
        color: "rgba(255, 255, 255, 0.3)",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        padding: "4px 8px",
        borderRadius: "4px",
        userSelect: "none" as const,
    },
};

export const Draw = ({ isDrawer = true }: DrawProps) => {
    return (
        <div style={styles.container}>

           
            {/* Canvas */}
            <div style={styles.canvasContainer}>
                <canvas style={styles.canvas} />
                {!isDrawer && <div style={styles.overlayLabel}>View Only</div>}
            </div>
        </div>
    );
};

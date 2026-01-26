"use client";
import React, { useEffect, useRef, useState } from "react";
import { Pencil, RectangleHorizontal as RectangleHorizontalIcon, Circle, Minus } from "lucide-react";
import { Game } from "../GameComponent/draw";
import { Socket } from "socket.io-client";

interface DrawProps {
    isDrawer?: boolean;
    roomId?: string;
    socket?: Socket | null;
}

const styles = {
    container: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column" as const,
        gap: "8px",
        position: "relative" as const,
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

export type Tool = "circle" | "rect" | "pencil" | "line";

export const Draw = ({ isDrawer = true, roomId, socket }: DrawProps) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("circle")

    useEffect(() => {
        game?.setTool(selectedTool);
    }, [selectedTool, game]);

    useEffect(() => {
        if (canvasRef.current && roomId && socket) {
            const g = new Game(canvasRef.current, roomId, socket);
            setGame(g);

            return () => {
                g.destroy();
            }
        }
    }, [canvasRef, roomId, socket]);

    // Handle Resize
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
                game?.clearCanvas(); // Redraw shapes after resize
            }
        };

        window.addEventListener("resize", resize);
        resize(); // Initial resize

        return () => window.removeEventListener("resize", resize);
    }, [game]);


    return (
        <div style={styles.container}>
            {isDrawer && (
                <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
            )}

            {/* Canvas */}
            <div style={styles.canvasContainer}>
                <canvas ref={canvasRef} style={styles.canvas} />
                {!isDrawer && <div style={styles.overlayLabel}>View Only</div>}
            </div>
        </div>
    );
};

function IconButton({ onClick, activated, icon }: { onClick: () => void, activated: boolean, icon: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            style={{
                background: activated ? "rgba(255, 255, 255, 0.2)" : "transparent",
                border: "none",
                borderRadius: "50%",
                padding: "8px",
                cursor: "pointer",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            {icon}
        </button>
    );
}

function Topbar({ selectedTool, setSelectedTool }: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
}) {
    return (
        <div style={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 10,
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: "50px",
            padding: "4px",
            border: "1px solid rgba(255,255,255,0.1)"
        }}>
            <div style={{ display: "flex", gap: "4px" }}>
                <IconButton
                    onClick={() => setSelectedTool("pencil")}
                    activated={selectedTool === "pencil"}
                    icon={<Pencil size={20} />}
                />
                <IconButton
                    onClick={() => setSelectedTool("rect")}
                    activated={selectedTool === "rect"}
                    icon={<RectangleHorizontalIcon size={20} />}
                />
                <IconButton
                    onClick={() => setSelectedTool("circle")}
                    activated={selectedTool === "circle"}
                    icon={<Circle size={20} />}
                />
                <IconButton
                    onClick={() => setSelectedTool("line")}
                    activated={selectedTool === "line"}
                    icon={<Minus size={20} />}
                />
            </div>
        </div>
    );
}
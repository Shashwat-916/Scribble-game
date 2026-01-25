"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

// Adjust imports to match your file structure
import { Chat } from "../../../Components/ChatComponent/Canvas";
import { Draw } from "../../../Components/DrawComponent/Canvas";
import { Score } from "../../../Components/Score/Score";


// 1. Define reusable "Glass" styles to keep code clean
const glassStyle = {
    background: "rgba(255, 255, 255, 0.05)", // bg-white/5
    backdropFilter: "blur(12px)",            // backdrop-blur-md
    WebkitBackdropFilter: "blur(12px)",      // Safari support
    border: "1px solid rgba(255, 255, 255, 0.2)", // border-white/20
    borderRadius: "24px",                    // rounded-3xl
    overflow: "hidden",
    position: "relative" as const, // Fix for TypeScript type
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" // shadow-2xl
};

const labelStyle = {
    position: "absolute" as const,
    top: "8px",
    left: "16px",
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    zIndex: 10,
    pointerEvents: "none" as const,
};

export default function RoomPage() {
    const params = useParams();
    const router = useRouter();
    
    const slug = typeof params?.slug === 'string' ? params.slug : params?.slug?.[0] || '';
    const [isAuthorized, setIsAuthorized] = useState(false);
    
    // 2. State for Responsive Layout (Mobile vs Desktop)
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Auth Logic
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("No access token found! Redirecting to lobby.");
            router.push("/"); 
            return;
        }
        setIsAuthorized(true);
        console.log("Joining room:", slug, "with token:", token);

        // Responsive Logic: Check window width
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768); // 768px is the standard 'md' breakpoint
        };
        
        // Check initially and add listener
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            // socket.disconnect();
            window.removeEventListener('resize', handleResize);
        };
    }, [slug, router]);

    if (!isAuthorized) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'white' }}>
                Loading room environment...
            </div>
        );
    }

    return (
        // MAIN CONTAINER
        <div 
            style={{
                display: "flex",
                // Mobile = Column, Desktop = Row
                flexDirection: isMobile ? "column" : "row", 
                height: "100%",
                width: "100%",
                gap: "16px", // gap-4
            }}
        >
            
            {/* --- 1. DRAWING AREA (70%) --- */}
            <div 
                style={{
                    ...glassStyle,
                    // Mobile = Height 70%, Desktop = Width 70%
                    width: isMobile ? "100%" : "60%",
                    height: isMobile ? "60%" : "100%",
                }}
            >
                <div style={{ ...labelStyle, color: "rgba(255, 255, 255, 0.4)" }}>Canvas</div>
                <Draw  />
            </div>

            {/* --- 2. SIDEBAR (30%) --- */}
            <div 
                style={{
                    display: "flex",
                    // Mobile = Row (side-by-side), Desktop = Column (stacked)
                    flexDirection: isMobile ? "row" : "column", 
                    width: isMobile ? "100%" : "40%",
                    height: isMobile ? "40%" : "100%",
                    gap: "16px",
                }}
            >
                
                {/* A. SCOREBOARD */}
                <div 
                    style={{
                        ...glassStyle,
                        background: "rgba(99, 102, 241, 0.1)", // Indigo tint
                        // Mobile = Width 40%, Desktop = Height 30%
                        width: isMobile ? "40%" : "100%",
                        height: isMobile ? "100%" : "30%",
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                     <div style={{ ...labelStyle, position: "relative", top: 0, left: 0, padding: "8px", width: "100%", textAlign: "center", background: "rgba(255,255,255,0.1)", color: "#c7d2fe" }}>
                        Leaderboard
                     </div>
                     <div style={{ flex: 1, overflow: "auto" }}>
                        <Score  />
                     </div>
                </div>

                {/* B. CHAT */}
                <div 
                    style={{
                        ...glassStyle,
                        background: "rgba(16, 185, 129, 0.1)", // Emerald tint
                        flex: 1, // Takes remaining space
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    <div style={{ ...labelStyle, position: "relative", top: 0, left: 0, padding: "8px", width: "100%", textAlign: "center", background: "rgba(255,255,255,0.1)", color: "#a7f3d0" }}>
                        Chat
                     </div>
                    <div style={{ flex: 1, position: "relative" }}>
                        <Chat  />
                    </div>
                </div>

            </div>
        </div>
    );
}
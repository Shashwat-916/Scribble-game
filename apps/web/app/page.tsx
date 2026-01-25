"use client"

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation'; // 1. For redirection
import { Copy, User, Plus, Sparkles } from "lucide-react";
import { styles, responsiveCSS } from "../Styles/app.style";
import { AVATARS } from "../Constants/avatar";
import AvatarGrid from '../Components/Avatar/AvatarSelector';
import { createRoom } from '../ApiServices/api';

export default function GlassLobby() {
  const router = useRouter();

  // State
  const [avatarId, setAvatarId] = useState(1);
  const [name, setName] = useState(""); // Track Input
  const [isLoading, setIsLoading] = useState(false); // Track Loading

  // 3. The Logic Function
  const handleCreateRoom = async () => {
    // Validation
    if (!name.trim()) {
      toast.error("Please enter a nickname!");
      return;
    }

    setIsLoading(true);

    try {
      // Call Backend
      const data = await createRoom(name, avatarId);

      // Store Token
      localStorage.setItem("token", data.token);

      // Redirect to Room
      router.push(`/room/${data.slug}`);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to get selected avatar image for the Right Section
  const selectedAvatar = AVATARS.find(a => a.id === avatarId);

  return (
    <div>
      <>
        <style>{responsiveCSS}</style>

        <div style={styles.pageContainer}>

          {/* Card Container */}
          <div className="glass-card-container" style={styles.card}>

            {/* LEFT SECTION */}
            <div className="left-section" style={styles.leftSection}>

              {/* Header */}
              <div style={styles.header}>
                <h1 style={styles.title}>
                  <Sparkles size={28} fill="#fff" /> Scribble
                </h1>
                <p style={styles.subtitle}>
                  Create a room, invite friends, and start drawing!
                </p>
              </div>

              {/* Avatar Grid Component */}
              <AvatarGrid
                value={avatarId}
                onChange={setAvatarId}
              />

              {/* Name Input */}
              <div>
                <label style={styles.label}>Your Nickname</label>
                <div style={styles.inputGroup}>
                  <User size={18} style={styles.inputIcon} />
                  <input
                    type="text"
                    placeholder="e.g. ShadowHunter"
                    style={styles.input}
                    value={name} // Bind value
                    onChange={(e) => setName(e.target.value)} // Update state
                    onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
                    onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Invite Link (Placeholder - Visual Only until room created) */}
              <div>
                <label style={styles.label}>Invite Link</label>
                <div style={styles.linkBox}>
                  <span style={styles.linkText}>
                    {/* Just a visual placeholder */}
                    scribble.io/room/...
                  </span>
                  <button style={styles.copyBtn} disabled>
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreateRoom} // Attach Handler
                disabled={isLoading}
                style={{
                  ...styles.mainButton,
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? "not-allowed" : "pointer"
                }}
                onMouseOver={(e) => !isLoading && (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseOut={(e) => !isLoading && (e.currentTarget.style.transform = "translateY(0)")}
              >
                {isLoading ? (
                  <span>Creating...</span>
                ) : (
                  <>
                    <Plus size={20} /> Create Room
                  </>
                )}
              </button>
            </div>

            {/* RIGHT SECTION: Visual / Illustration */}
            <div className="right-section" style={styles.rightSection}>
              <div style={styles.illustration}>
                <div style={styles.floatingBadge}>Selected</div>

                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>

                  {/* 4. Show the ACTUAL selected avatar here */}
                  {selectedAvatar && (
                    <img
                      src={selectedAvatar.src}
                      alt="Selected"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "contain",
                        marginBottom: "16px",
                        filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.5))",
                        transform: "rotate(-5deg)"
                      }}
                    />
                  )}

                  <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>
                    {name || "Player"} {/* Dynamic Name Preview */}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Ready to Draw</div>
                </div>

                {/* Decorative circle */}
                <div style={{
                  position: "absolute",
                  bottom: "-20px",
                  left: "-20px",
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "linear-gradient(45deg, #ec4899, #8b5cf6)",
                  filter: "blur(40px)",
                  zIndex: -1
                }} />
              </div>
            </div>

          </div>
        </div>
      </>
    </div>
  );
}
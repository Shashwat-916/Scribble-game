"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Copy, User, Plus, Sparkles, LogIn, Hash, Check } from "lucide-react";
import { styles, responsiveCSS } from "../Styles/app.style";
import { AVATARS } from "../Constants/avatar";
import AvatarGrid from '../Components/Avatar/AvatarSelector';
import { createRoom, joinRoom } from '../ApiServices/api';

export default function GlassLobby() {
  const router = useRouter();

  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [avatarId, setAvatarId] = useState(1);
  const [name, setName] = useState("");
  const [roomIdInput, setRoomIdInput] = useState(""); // User input for Room ID/Slug
  const [isLoading, setIsLoading] = useState(false);

  // --- COUNTDOWN STATE ---
  const [createdRoomSlug, setCreatedRoomSlug] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // --- COUNTDOWN EFFECT ---
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Time's up -> Go to room
      if (createdRoomSlug) {
        router.push(`/room/${createdRoomSlug}`);
      }
    }
  }, [countdown, createdRoomSlug, router]);

  // --- MAIN HANDLER ---
  const handleSubmit = async () => {
    // 1. Validation
    if (!name.trim()) {
      toast.error("Please enter a nickname!");
      return;
    }

    if (activeTab === 'join' && !roomIdInput.trim()) {
      toast.error("Please enter a Room ID!");
      return;
    }

    setIsLoading(true);

    try {
      if (activeTab === 'create') {
        // ==========================
        // CREATE FLOW
        // ==========================
        const data = await createRoom(name, avatarId);

        // A. Store Token
        if (data?.token) {
          localStorage.setItem("token", data.token);
        }

        // B. Start Countdown Flow
        setCreatedRoomSlug(data.slug);
        setIsLoading(false); // Stop loading so UI shows link
        setCountdown(10);    // Start 10s timer

        toast((t) => (
          <div className="flex items-center gap-2">
            <span><b>Room Created!</b><br />Copy link below. Entering in 10s...</span>
          </div>
        ), { duration: 6000, icon: '🎉' });

      } else {
        // ==========================
        // JOIN FLOW
        // ==========================
        // We pass 'roomIdInput' as the 'slug' argument
        const data = await joinRoom(name, avatarId, roomIdInput);

        // A. Store Token
        if (data?.token) {
          localStorage.setItem("token", data.token);
        }

        // B. Immediate Redirect
        toast.success("Joined successfully!");
        router.push(`/room/${data.slug}`);
      }

    } catch (err: any) {
      // Error is already processed in api.ts, so err.message is clean
      toast.error(err.message || "Something went wrong");
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!createdRoomSlug) return;
    const link =`${createdRoomSlug}` 
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const skipCountdown = () => {
    if (createdRoomSlug) router.push(`/room/${createdRoomSlug}`);
  }

  const selectedAvatar = AVATARS.find((a: any) => a.id === avatarId);

  // Helper styles for tabs
  const tabStyles = {
    container: {
      display: "flex", backgroundColor: "rgba(255,255,255,0.05)", padding: "4px",
      borderRadius: "12px", marginBottom: "24px", border: "1px solid rgba(255,255,255,0.1)"
    },
    button: (isActive: boolean) => ({
      flex: 1, padding: "10px", borderRadius: "10px", border: "none", cursor: "pointer",
      fontWeight: 600, fontSize: "0.9rem", transition: "all 0.2s ease",
      backgroundColor: isActive ? "rgba(255,255,255,0.15)" : "transparent",
      color: isActive ? "#fff" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
    })
  };

  return (
    <div>
      <>
        <style>{responsiveCSS}</style>

        <div style={styles.pageContainer}>
          <div className="glass-card-container" style={styles.card}>

            {/* LEFT SECTION */}
            <div className="left-section" style={styles.leftSection}>

              <div style={styles.header}>
                <h1 style={styles.title}>
                  <Sparkles size={28} fill="#fff" /> Scribble
                </h1>
                <p style={styles.subtitle}>
                  {activeTab === 'create'
                    ? "Create a room and invite friends!"
                    : "Enter a Room ID to join the fun!"}
                </p>
              </div>

              {/* TAB SWITCHER */}
              <div style={{ ...tabStyles.container, opacity: countdown !== null ? 0.5 : 1, pointerEvents: countdown !== null ? 'none' : 'auto' }}>
                <button onClick={() => setActiveTab('create')} style={tabStyles.button(activeTab === 'create')}>
                  <Plus size={16} /> Create
                </button>
                <button onClick={() => setActiveTab('join')} style={tabStyles.button(activeTab === 'join')}>
                  <LogIn size={16} /> Join
                </button>
              </div>

              <AvatarGrid value={avatarId} onChange={setAvatarId} />

              <div>
                <label style={styles.label}>Your Nickname</label>
                <div style={styles.inputGroup}>
                  <User size={18} style={styles.inputIcon} />
                  <input
                    type="text" placeholder="e.g. Zoro" style={styles.input}
                    value={name} onChange={(e) => setName(e.target.value)}
                    disabled={isLoading || countdown !== null}
                  />
                </div>
              </div>

              {/* DYNAMIC SECTION (Link vs Room ID Input) */}
              {activeTab === 'create' ? (
                <div>
                  <label style={styles.label}>
                    {createdRoomSlug ? "Invite Link Ready" : "Invite Link Preview"}
                  </label>
                  <div style={{
                    ...styles.linkBox,
                    borderColor: createdRoomSlug ? "#4ade80" : "rgba(255,255,255,0.05)",
                    backgroundColor: createdRoomSlug ? "rgba(74, 222, 128, 0.1)" : "rgba(255,255,255,0.05)"
                  }}>
                    <span style={{ ...styles.linkText, color: createdRoomSlug ? "#fff" : "#94a3b8" }}>
                      {createdRoomSlug
                        ? `${typeof window !== 'undefined' ? "" : ''}${createdRoomSlug}`
                        : "room..."}
                    </span>
                    <button
                      style={styles.copyBtn}
                      disabled={!createdRoomSlug}
                      onClick={copyToClipboard}
                    >
                      {isCopied ? <Check size={16} color="#4ade80" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label style={styles.label}>Room ID</label>
                  <div style={styles.inputGroup}>
                    <Hash size={18} style={styles.inputIcon} />
                    <input
                      type="text" placeholder="e.g. 123456"
                      style={{ ...styles.input, borderColor: "#a855f7" }}
                      value={roomIdInput} onChange={(e) => setRoomIdInput(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              {/* MAIN ACTION BUTTON */}
              <button
                onClick={countdown !== null ? skipCountdown : handleSubmit}
                disabled={isLoading}
                style={{
                  ...styles.mainButton,
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  background: activeTab === 'create'
                    ? "linear-gradient(135deg, #6366f1, #a855f7)"
                    : "linear-gradient(135deg, #ec4899, #8b5cf6)"
                }}
              >
                {isLoading ? (
                  <span>Wait...</span>
                ) : countdown !== null ? (
                  <span>Enter Room Now ({countdown}s)</span>
                ) : (
                  <>
                    {activeTab === 'create' ? <Plus size={20} /> : <LogIn size={20} />}
                    {activeTab === 'create' ? "Create Room" : "Join Game"}
                  </>
                )}
              </button>

            </div>

            {/* RIGHT SECTION (Preview) */}
            <div className="right-section" style={styles.rightSection}>
              <div style={styles.illustration}>
                <div style={styles.floatingBadge}>
                  {activeTab === 'create' ? 'Host' : 'Guest'}
                </div>

                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  {selectedAvatar && (
                    <img
                      src={selectedAvatar.src} alt="Selected"
                      style={{
                        width: "120px", height: "120px", objectFit: "contain", marginBottom: "16px",
                        filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.5))", transform: "rotate(-5deg)"
                      }}
                    />
                  )}
                  <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>
                    {name || "Player"}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                    {countdown !== null ? "Launching..." : activeTab === 'create' ? "Creating Lobby" : "Joining Lobby"}
                  </div>
                </div>

                {/* Decorative Blob */}
                <div style={{
                  position: "absolute", bottom: "-20px", left: "-20px",
                  width: "80px", height: "80px", borderRadius: "50%",
                  background: activeTab === 'create'
                    ? "linear-gradient(45deg, #ec4899, #8b5cf6)"
                    : "linear-gradient(45deg, #3b82f6, #10b981)",
                  filter: "blur(40px)", zIndex: -1
                }} />
              </div>
            </div>

          </div>
        </div>
      </>
    </div>
  );
}
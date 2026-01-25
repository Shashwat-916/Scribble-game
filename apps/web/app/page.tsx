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
  const [roomId, setRoomId] = useState(""); // Input for Joining
  const [isLoading, setIsLoading] = useState(false);

  // --- NEW STATE FOR COUNTDOWN FLOW ---
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
      // Countdown finished -> Enter Room
      router.push(`/room/${createdRoomSlug}`);
    }
  }, [countdown, createdRoomSlug, router]);

  // --- HANDLERS ---
  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter a nickname!");
      return;
    }

    setIsLoading(true);

    try {
      let data;
      
      if (activeTab === 'create') {
        // --- CREATE FLOW ---
        data = await createRoom(name, avatarId);
        
        // 1. Store Token
        localStorage.setItem("token", data.token);
        
        // 2. PAUSE & SHOW INFO (Don't redirect yet)
        setCreatedRoomSlug(data.slug);
        setIsLoading(false); // Stop loading spinner so we can show countdown
        setCountdown(10); // Start 10s timer

        // 3. Show Instructions Toast
        toast((t) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span><b>Room Created!</b><br/>Please copy the invite link. <br/>Entering in 10s...</span>
            </div>
        ), { duration: 6000, icon: '📋' });

      } else {
        // --- JOIN FLOW (Standard) ---
        if (!roomId.trim()) {
          toast.error("Please enter a Room ID!");
          setIsLoading(false);
          return;
        }
        data = await joinRoom(name, avatarId, roomId);
        localStorage.setItem("token", data.token);
        toast.success("Joined room!");
        router.push(`/room/${data.slug}`);
      }

    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!createdRoomSlug) return;
    const link = `${window.location.origin}/room/${createdRoomSlug}`;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Helper to skip countdown manually
  const skipCountdown = () => {
      if(createdRoomSlug) router.push(`/room/${createdRoomSlug}`);
  }

  const selectedAvatar = AVATARS.find(a => a.id === avatarId);

  // Styles helpers...
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

              {/* TAB SWITCHER (Disabled during countdown) */}
              <div style={{...tabStyles.container, opacity: countdown !== null ? 0.5 : 1, pointerEvents: countdown !== null ? 'none' : 'auto'}}>
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
                    type="text" placeholder="e.g. ShadowHunter" style={styles.input}
                    value={name} onChange={(e) => setName(e.target.value)}
                    disabled={isLoading || countdown !== null}
                  />
                </div>
              </div>

              {/* DYNAMIC SECTION */}
              {activeTab === 'create' ? (
                <div>
                  <label style={styles.label}>
                     {createdRoomSlug ? "Your Room Invite Link" : "Invite Link Preview"}
                  </label>
                  <div style={{
                      ...styles.linkBox,
                      borderColor: createdRoomSlug ? "#4ade80" : "rgba(255,255,255,0.05)", // Green border if ready
                      backgroundColor: createdRoomSlug ? "rgba(74, 222, 128, 0.1)" : "rgba(255,255,255,0.05)"
                  }}>
                    <span style={{...styles.linkText, color: createdRoomSlug ? "#fff" : "#94a3b8"}}>
                       {createdRoomSlug 
                         ? `${typeof window !== 'undefined' ? window.location.host : ''}/room/${createdRoomSlug}`
                         : "scribble.io/room/..."}
                    </span>
                    <button 
                        style={styles.copyBtn} 
                        disabled={!createdRoomSlug} 
                        onClick={copyToClipboard}
                    >
                        {isCopied ? <Check size={16} color="#4ade80"/> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label style={styles.label}>Room ID</label>
                  <div style={styles.inputGroup}>
                    <Hash size={18} style={styles.inputIcon} />
                    <input
                      type="text" placeholder="e.g. cool-tiger-123"
                      style={{...styles.input, borderColor: "#a855f7"}}
                      value={roomId} onChange={(e) => setRoomId(e.target.value)}
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
                   // COUNTDOWN STATE UI
                   <span>Enter Room Now ({countdown}s)</span> 
                ) : (
                   // NORMAL STATE UI
                  <>
                    {activeTab === 'create' ? <Plus size={20} /> : <LogIn size={20} />} 
                    {activeTab === 'create' ? "Create Room" : "Enter Room"}
                  </>
                )}
              </button>

            </div>

            {/* RIGHT SECTION */}
            <div className="right-section" style={styles.rightSection}>
              <div style={styles.illustration}>
                <div style={styles.floatingBadge}>
                   {activeTab === 'create' ? 'New' : 'Joining'}
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
                    {countdown !== null ? "Creating Lobby..." : activeTab === 'create' ? "Ready to Host" : "Ready to Join"}
                  </div>
                </div>

                {/* Decorative Circle */}
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
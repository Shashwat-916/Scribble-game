"use client";
import React from 'react';
import { Sparkles, User, Hash, Plus, LogIn } from "lucide-react";
import { styles, responsiveCSS } from "../Styles/app.style";
import AvatarGrid from '../Components/Avatar/AvatarSelector';

// Imports from our new split
import { useLobbyLogic } from '../Hooks/useLobbyLogic';
import { LobbyTabs } from '../Components/GameScene/Lobby.Tab';
import { PlayerPreview } from '../Components/GameScene/PlayerPreview';
import { RoomLinkSection } from '../Components/GameScene/RoomLinkSection';

export default function GlassLobby() {
  const {
    activeTab, setActiveTab,
    avatarId, setAvatarId,
    name, setName,
    roomIdInput, setRoomIdInput,
    isLoading, createdRoomSlug, countdown, isCopied,
    handleSubmit, copyToClipboard, skipCountdown
  } = useLobbyLogic();

  return (
    <div>
      <style>{responsiveCSS}</style>
      <div style={styles.pageContainer}>
        <div className="glass-card-container" style={styles.card}>

          {/* LEFT SECTION */}
          <div className="left-section" style={styles.leftSection}>
            <div style={styles.header}>
              <h1 style={styles.title}><Sparkles size={28} fill="#fff" /> Scribble</h1>
              <p style={styles.subtitle}>
                {activeTab === 'create' ? "Create a room and invite friends!" : "Enter a Room ID to join!"}
              </p>
            </div>

            <LobbyTabs
              activeTab={activeTab}
              onChange={setActiveTab}
              disabled={countdown !== null}
            />

            <AvatarGrid value={avatarId} onChange={setAvatarId} />

            {/* User Inputs */}
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

            {/* Conditional Input: Link Display OR Room ID Input */}
            {activeTab === 'create' ? (
              <RoomLinkSection slug={createdRoomSlug} onCopy={copyToClipboard} isCopied={isCopied} />
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

            {/* Main Action Button */}
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
              {isLoading ? "Wait..." : countdown !== null ? `Enter Now (${countdown}s)` : (
                <>
                  {activeTab === 'create' ? <Plus size={20} /> : <LogIn size={20} />}
                  {activeTab === 'create' ? "Create Room" : "Join Game"}
                </>
              )}
            </button>
          </div>

          {/* RIGHT SECTION */}
          <PlayerPreview
            avatarId={avatarId}
            name={name}
            activeTab={activeTab}
            countdown={countdown}
          />

        </div>
      </div>
    </div>
  );
}
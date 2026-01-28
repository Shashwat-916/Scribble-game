"use client";
import React from "react";
import { Send, User } from "lucide-react";
import { AVATARS } from "../../Constants/avatar";
import { styles } from "./styles";

export const Chat = () => {
  return (
    <div style={styles.container}>
      {/* Messages */}
      <div style={styles.messageList} className="no-scrollbar">
        <div style={styles.emptyState}>Chat empty. Start guessing!</div>

        {/* Example static message */}
        <div style={styles.messageRow}>
          <div style={styles.avatarContainer}>
            <User size={14} color="rgba(255,255,255,0.5)" />
          </div>

          <div style={{ ...styles.bubble, ...styles.otherBubble }}>
            <span style={styles.senderName}>Username</span>
            Hello there 👋
          </div>
        </div>

        <div style={{ ...styles.messageRow, ...styles.ownMessageRow }}>
          <div style={styles.avatarContainer} />

          <div style={{ ...styles.bubble, ...styles.ownBubble }}>
            Hi! 😊
          </div>
        </div>
      </div>

      {/* Input */}
      <div style={styles.inputArea}>
        <input
          type="text"
          placeholder="Type a message..."
          style={styles.input}
          disabled
        />
        <button style={{ ...styles.sendButton, opacity: 0.6 }} disabled>
          <Send size={18} color="white" />
        </button>
      </div>
    </div>
  );
};

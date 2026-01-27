"use client";
import React from "react";
import { Send, User } from "lucide-react";
import { AVATARS } from "../../Constants/avatar";
import{ styles } from "./styles"

interface Message {
    name: string;
    message: string;
    avatarId?: number;
}

interface ChatProps {
    messages: Message[];
    onSendMessage: (message: string) => void;
}


export const Chat = () => {
  return (
    <div style={styles.container}>
      {/* Messages */}
      <div style={styles.messageList} className="no-scrollbar">
        <div style={styles.emptyState}>Chat empty. Start guessing!</div>

        {/* Example static message (remove if not needed) */}
        <div style={styles.messageRow}>
          <div style={styles.avatarContainer}>
            <User size={16} color="rgba(255,255,255,0.5)" />
          </div>

          <div style={styles.bubble}>
            <span style={styles.senderName}>Player</span>
            This is a static chat message.
          </div>
        </div>
      </div>

      {/* Input (UI only) */}
      <div style={styles.inputArea}>
        <input
          type="text"
          placeholder="Type a message..."
          style={styles.input}
          disabled
        />
        <button style={styles.sendButton} disabled>
          <Send size={18} color="white" />
        </button>
      </div>
    </div>
  );
};
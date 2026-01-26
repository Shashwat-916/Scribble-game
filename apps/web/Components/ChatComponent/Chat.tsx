"use client";
import React from "react";
import { Send, User } from "lucide-react";
import { AVATARS } from "../../Constants/avatar";

interface Message {
    name: string;
    message: string;
    avatarId?: number;
}

interface ChatProps {
    messages: Message[];
    onSendMessage: (message: string) => void;
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column" as const,
        height: "100%",
        width: "100%",
    },
    messageList: {
        flex: 1,
        overflowY: "auto" as const,
        padding: "12px 16px",
        display: "flex",
        flexDirection: "column" as const,
        gap: "12px",
    },
    emptyState: {
        textAlign: "center" as const,
        color: "rgba(255, 255, 255, 0.4)",
        fontSize: "14px",
        marginTop: "24px",
    },
    messageRow: {
        display: "flex",
        alignItems: "flex-end",
        gap: "8px",
    },
    avatarContainer: {
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarImg: {
        width: "100%",
        height: "100%",
        objectFit: "cover" as const,
    },
    bubble: {
        maxWidth: "75%",
        padding: "8px 12px",
        borderRadius: "16px",
        fontSize: "14px",
        lineHeight: "1.4",
        wordBreak: "break-word" as const,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        color: "#ffffff",
    },
    senderName: {
        fontSize: "10px",
        color: "rgba(255, 255, 255, 0.5)",
        fontWeight: 600,
        marginBottom: "2px",
        display: "block",
    },
    inputArea: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    input: {
        flex: 1,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: "9999px",
        padding: "8px 16px",
        fontSize: "14px",
        color: "#ffffff",
        border: "none",
        outline: "none",
    },
    sendButton: {
        width: "36px",
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        backgroundColor: "#10b981",
        border: "none",
        opacity: 0.6,
    },
};

export const Chat = ({ messages, onSendMessage }: ChatProps) => {
    const bottomRef = React.useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = React.useState("");

    const handleSend = () => {
        if (!inputValue.trim()) return;
        onSendMessage(inputValue);
        setInputValue("");
    };

    React.useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div style={styles.container}>

            {/* Messages */}
            <div style={styles.messageList} className="no-scrollbar">
                {messages.length === 0 && (
                    <div style={styles.emptyState}>
                        Chat empty. Start guessing!
                    </div>
                )}

                {messages.map((msg, idx) => {
                    const avatar = AVATARS.find(a => a.id === msg.avatarId);

                    return (
                        <div key={idx} style={styles.messageRow}>
                            <div style={styles.avatarContainer}>
                                {avatar ? (
                                    <img src={avatar.src} alt={msg.name} style={styles.avatarImg} />
                                ) : (
                                    <User size={16} color="rgba(255,255,255,0.5)" />
                                )}
                            </div>

                            <div style={styles.bubble}>
                                <span style={styles.senderName}>{msg.name}</span>
                                {msg.message}
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input (UI only) */}
            <div style={styles.inputArea}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    style={styles.input}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSend();
                    }}
                />
                <button style={styles.sendButton} onClick={handleSend}>
                    <Send size={18} color="white" />
                </button>
            </div>
        </div>
    );
};

import { Server } from "socket.io";

// --- Types ---
export interface Player {
    id: string;          // Socket ID
    userId: string;      // Database ID (for uniqueness & frontend key)
    name: string;
    score: number;
    avatarId: number;
    isDrawer: boolean;   // Kya ye banda abhi draw kar raha hai?
}

// Words Collection
const WORDS = [
    "Apple", "Banana", "Car", "Dog", "Elephant", "Fish", "Guitar", "House",
    "Ice Cream", "Jellyfish", "Kite", "Lion", "Moon", "Nest", "Orange",
    "Pencil", "Queen", "Robot", "Snake", "Tree", "Umbrella", "Van", "Watch"
];

// ⏳ Config: Round Time (Seconds)
const ROUND_DURATION = 80;

export class Game {
    public roomId: string;
    public players: Player[];

    private io: Server;
    private currentDrawerIndex: number = 0; // Turn tracker
    private currentWord: string = "";

    // Timer Variables
    private timeLeft: number = ROUND_DURATION;
    private timer: NodeJS.Timeout | null = null;

    // State Flags
    private isGameStarted: boolean = false;
    private roundActive: boolean = false;

    constructor(io: Server, roomId: string) {
        this.io = io;
        this.roomId = roomId;
        this.players = [];
    }

    // ==================================================
    // 1. PLAYER MANAGEMENT (JOIN / LEAVE)
    // ==================================================

    // ==================================================
    // 1. PLAYER MANAGEMENT (JOIN / LEAVE)
    // ==================================================

    addPlayer(socketId: string, userId: string, name: string, avatarId: number) {
        // Duplicate check via userId (handles re-connections/strict mode)
        const existingPlayerIndex = this.players.findIndex(p => p.userId === userId);

        if (existingPlayerIndex !== -1) {
            // Update socket ID if user exists (re-connected)
            const player = this.players[existingPlayerIndex];
            if (player) {
                player.id = socketId;
                player.name = name;
                player.avatarId = avatarId;
            }

            // Re-broadcast list so everyone updates the socket ID mapping if needed
            this.io.to(this.roomId).emit("user-joined", this.players);
            return;
        }

        const player: Player = {
            id: socketId,
            userId,
            name: name,
            avatarId: avatarId,
            score: 0,
            isDrawer: false
        };
        this.players.push(player);

        this.io.to(this.roomId).emit("user-joined", this.players);

        // Notification instead of System Chat
        this.io.to(this.roomId).emit("notification", {
            type: "success",
            message: `${name} joined the game!`
        });

        // REMOVED: Auto-Start Logic (Now Admin controlled)
    }

    removePlayer(socketId: string) {
        // 1. Find who is leaving
        const playerToRemove = this.players.find(p => p.id === socketId);
        if (!playerToRemove) return;

        // 2. Remove from list
        this.players = this.players.filter(p => p.id !== socketId);

        // 3. Notify others
        this.io.to(this.roomId).emit("user-left", this.players);

        // Notification instead of System Chat
        this.io.to(this.roomId).emit("notification", {
            type: "error",
            message: `${playerToRemove.name} left the game.`
        });

        // --- CRITICAL: DRAWER LEFT LOGIC ---
        // Agar Jane wala banda Drawer tha aur round chal raha tha
        if (playerToRemove.isDrawer && this.roundActive) {
            this.io.to(this.roomId).emit("notification", {
                type: "error",
                message: `${playerToRemove.name} (Drawer) left! Round ending.`
            });
            this.endRound("Drawer Disconnected");
        }

        // Agar players < 2 ho gaye, toh game stop kar do
        if (this.players.length < 2) {
            this.stopGame();
        }
    }

    // ==================================================
    // 2. GAME LOOP (START / NEXT TURN / END)
    // ==================================================

    public startGame() {
        if (this.isGameStarted || this.players.length < 2) return;

        this.isGameStarted = true;
        this.currentDrawerIndex = -1; // -1 set kiya taaki first turn 0 ho
        this.startNextTurn();
    }

    private startNextTurn() {
        // A. Reset Old State
        this.clearTimer();
        this.players.forEach(p => p.isDrawer = false);
        this.roundActive = false; // Not active until word is selected

        // B. Pick Next Drawer (Circular Queue)
        // Logic: 0 -> 1 -> 2 -> 0 -> 1 ...
        this.currentDrawerIndex = (this.currentDrawerIndex + 1) % this.players.length;

        const drawer = this.players[this.currentDrawerIndex];

        // --- GUARD CLAUSE (TypeScript Safety) ---
        if (!drawer) {
            console.error("Game Error: No drawer found!");
            this.stopGame();
            return;
        }
        // ----------------------------------------

        drawer.isDrawer = true;

        // C. Generate 3 Random Words
        const shuffled = [...WORDS].sort(() => 0.5 - Math.random());
        const options = shuffled.slice(0, 3);

        // D. Notify Drawer to Choose
        this.io.to(drawer.id).emit("choose-word", {
            options,
            duration: 15 // 15s to choose
        });

        // Notify others
        this.io.to(this.roomId).emit("chat-message", {
            name: "System",
            message: `${drawer.name} is choosing a word...`
        });
    }

    public handleWordSelection(socketId: string, word: string) {
        const drawer = this.players[this.currentDrawerIndex];
        if (!drawer || drawer.id !== socketId) return;

        this.currentWord = word;
        this.roundActive = true;

        // D. Notify Clients (Game Start)
        this.io.to(drawer.id).emit("your-turn", {
            word: this.currentWord,
            duration: ROUND_DURATION
        });

        this.io.to(this.roomId).emit("new-round", {
            drawerName: drawer.name,
            drawerId: drawer.id,
            wordLength: this.currentWord.length, // Hint: _ _ _ _
            duration: ROUND_DURATION
        });

        // E. Start Timer
        this.timeLeft = ROUND_DURATION;

        this.timer = setInterval(() => {
            this.timeLeft--;

            if (this.timeLeft <= 0) {
                this.endRound(`Time Up! Word was: ${this.currentWord}`);
            }
        }, 1000);
    }

    private endRound(reason: string) {
        this.clearTimer();
        this.roundActive = false;

        // Reveal Word
        this.io.to(this.roomId).emit("round-ended", {
            word: this.currentWord,
            reason: reason
        });

        // 5 Second Break -> Next Round
        setTimeout(() => {
            if (this.players.length >= 2) {
                this.startNextTurn();
            } else {
                this.stopGame();
            }
        }, 5000);
    }

    private stopGame() {
        this.isGameStarted = false;
        this.clearTimer();
        this.io.to(this.roomId).emit("chat-message", {
            name: "System",
            message: "Not enough players to continue."
        });
    }

    // ==================================================
    // 3. LOGIC HANDLERS (CHAT / GUESS / CLEAR)
    // ==================================================

    public handleMessage(socketId: string, message: string) {
        const player = this.players.find(p => p.id === socketId);
        if (!player) return;

        // Case 1: Game chalu nahi hai -> Normal Chat
        if (!this.roundActive) {
            this.io.to(this.roomId).emit("chat-message", { name: player.name, message });
            return;
        }

        // Case 2: Drawer cheating kar raha hai -> Normal Chat
        if (player.isDrawer) {
            this.io.to(this.roomId).emit("chat-message", { name: player.name, message });
            return;
        }

        // Case 3: CHECK GUESS
        if (message.trim().toLowerCase() === this.currentWord.toLowerCase()) {
            // 🎉 CORRECT GUESS!
            // STRICT 10 Points as requested
            const points = 10;

            player.score += points;

            const drawer = this.players[this.currentDrawerIndex];
            if (drawer) {
                // Drawer gets bonus for good drawing? Maybe 5? 
                // Requests said "give him points 10 okay" referring to guesser.
                // We'll give drawer 5 for consistency with standard Pictionary.
                drawer.score += 5;
            }

            this.broadcastLeaderboard();
            this.io.to(this.roomId).emit("user-guessed", {
                name: player.name,
                score: player.score
            });

            this.io.to(this.roomId).emit("chat-message", {
                name: "System",
                message: `${player.name} guessed the word correctly!`
            });

            // Standard Scribble: round continues for others? Or ends?
            // "give him points 10 okay" implies we handle the win.
            // Usually, if one guesses, others have time. But simplistic implementation: End Round or let Timer run.
            // Current code ends round. Let's stick to that for now to avoid complexity explosion.
            this.endRound(`${player.name} guessed the word!`);
        } else {
            // Wrong Guess -> Normal Chat
            this.io.to(this.roomId).emit("chat-message", { name: player.name, message });
        }
    }

    // --- NEW: Handle Clear Canvas (Securely) ---
    public handleClearCanvas(socketId: string) {
        const player = this.players.find(p => p.id === socketId);

        // Validation: Sirf Drawer hi clear kar sakta hai aur round active hona chahiye
        if (player && player.isDrawer && this.roundActive) {
            this.io.to(this.roomId).emit("clear-canvas");
        }
    }

    // ==================================================
    // 4. UTILITIES
    // ==================================================

    private broadcastLeaderboard() {
        const leaderboard = [...this.players].sort((a, b) => b.score - a.score);
        this.io.to(this.roomId).emit("score-update", leaderboard);
    }

    private clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}
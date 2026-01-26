import { Server } from "socket.io";
import { Game } from "./game.js";

export class RoomManager {
    // Map: RoomID -> Game Instance
    private rooms: Map<string, Game> = new Map();

    // Quick Lookup: SocketID -> RoomID (To handle disconnects fast)
    private userRoomMapping: Map<string, string> = new Map();

    private io: Server;

    constructor(io: Server) {
        this.io = io;
    }

    // 1. Join Room
    public joinRoom(roomId: string, socketId: string, userId: string, name: string, avatarId: number) {
        // Create Game instance if it doesn't exist
        let game = this.rooms.get(roomId);
        if (!game) {
            game = new Game(this.io, roomId);
            this.rooms.set(roomId, game);
            // game.startGame(); // Removed auto-start, now Admin controlled
        }

        // Add player to the game logic
        game.addPlayer(socketId, userId, name, avatarId);

        // Map user to this room for quick lookup later
        this.userRoomMapping.set(socketId, roomId);
    }

    // 2. Handle Chat / Guesses
    public handleChat(roomId: string, socketId: string, message: string) {
        const game = this.rooms.get(roomId);
        if (game) {
            game.handleMessage(socketId, message);
        }
    }

    // 3. Handle Canvas Clear (Securely)
    public handleClearCanvas(roomId: string, socketId: string) {
        const game = this.rooms.get(roomId);
        if (game) {
            game.handleClearCanvas(socketId);
        }
    }

    // 4. Start Game (Admin only)
    public handleStartGame(roomId: string, socketId: string) {
        const game = this.rooms.get(roomId);
        if (game) {
            game.startGame();
        }
    }

    // 5. Handle Word Selection
    public handleWordSelection(roomId: string, socketId: string, word: string) {
        const game = this.rooms.get(roomId);
        if (game) {
            game.handleWordSelection(socketId, word);
        }
    }

    // 4. Handle Disconnects
    public onDisconnect(socketId: string) {
        // Find which room this user was in
        const roomId = this.userRoomMapping.get(socketId);
        if (!roomId) return;

        const game = this.rooms.get(roomId);
        if (game) {
            // Remove player from Game Logic
            game.removePlayer(socketId);

            // Garbage Collection: If room is empty, delete the game to save RAM
            if (game.players.length === 0) {
                this.rooms.delete(roomId);
            }
        }

        // Clean up mapping
        this.userRoomMapping.delete(socketId);
    }
}
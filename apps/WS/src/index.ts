import { Server } from "socket.io";
import { createServer } from "http";
import jwt from "jsonwebtoken";
// Make sure these paths match your monorepo structure
import { JWT_SECRET, WS_PORT } from "@repo/env/common";
import prisma from "@repo/prisma/prisma";
import { RoomManager } from "./RoomManager.js";

const httpServer = createServer();

// --- 1. SETUP SOCKET SERVER ---
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins (localhost:3000, etc.)
    methods: ["GET", "POST"]
  }
});

const roomManager = new RoomManager(io);

// Helper: Decode Token
function checkAuth(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET || "secret") as { userId: string };
    return decoded.userId;
  } catch (e) {
    return null;
  }
}

io.on("connection", async (socket) => {
  // --- 2. AUTHENTICATION & SETUP ---

  // Frontend sends: io(URL, { auth: { token }, query: { roomId } })
  const token = socket.handshake.auth.token as string;
  const roomId = socket.handshake.query.roomId as string;

  // Basic Validation
  if (!token || !roomId) {
    socket.disconnect();
    return;
  }

  // Verify JWT
  const userId = checkAuth(token);
  if (!userId) {
    console.log("Unauthorized connection attempt");
    socket.disconnect();
    return;
  }

  // Fetch User Details from DB (So we have the correct Name and Avatar)
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    console.log("User not found in DB");
    socket.disconnect();
    return;
  }

  console.log(`User Connected: ${user.username} (${user.id}) -> Room: ${roomId}`);

  // Join the Socket.IO Channel (For broadcasting)
  socket.join(roomId);

  // Register User in Game Logic
  roomManager.joinRoom(roomId, socket.id, user.id, user.username, user.avatarId);


  // --- 3. EVENT LISTENERS ---

  // A. Draw Event (Relay directly for performance)
  // Logic: Send to everyone in the room EXCEPT the sender
  socket.on("draw", (data) => {
    // 'data' structure: { roomId, data: { prevPoint, currentPoint, color, width } }
    socket.to(roomId).emit("draw-line", data.data);
  });

  // NEW: Shape Event (Persist & Relay)
  socket.on("draw-shape", async (data) => {
    // data: { shape, roomId }
    // 1. Relay to others
    socket.to(roomId).emit("draw-shape", data);

    // 2. Persist to DB (Async, don't block)
    try {
      await prisma.shape.create({
        data: {
          roomId: roomId,
          type: data.shape.type,
          data: data.shape // Store the full shape object as JSON
        }
      });
    } catch (e) {
      console.error("Failed to save shape:", e);
    }
  });

  // B. Chat / Guess Event
  socket.on("send-message", (data) => {
    roomManager.handleChat(roomId, socket.id, data.message);
  });

  // C. Clear Canvas Event
  socket.on("clear-canvas", () => {
    roomManager.handleClearCanvas(roomId, socket.id);
  });

  // User wants to start game
  socket.on("start-game", () => {
    roomManager.handleStartGame(roomId, socket.id);
  });

  // Drawer selected a word
  socket.on("word-selected", ({ word }: { word: string }) => {
    roomManager.handleWordSelection(roomId, socket.id, word);
  });

  // D. Disconnect
  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${user.username}`);
    roomManager.onDisconnect(socket.id);
  });
});

// Start the Server
const PORT = 8080;
httpServer.listen(WS_PORT, () => {
  console.log(`WebSocket Server running on port ${PORT}`);
});
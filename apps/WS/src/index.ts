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
  roomManager.joinRoom(roomId, socket.id, user.username, user.avatarId);


  // --- 3. EVENT LISTENERS ---

  // A. Draw Event (Relay directly for performance)
  // Logic: Send to everyone in the room EXCEPT the sender
  socket.on("draw", (data) => {
    // 'data' structure: { roomId, data: { prevPoint, currentPoint, color, width } }
    socket.to(roomId).emit("draw-line", data.data);
  });

  // B. Chat / Guess Event
  socket.on("send-message", (data) => {
    roomManager.handleChat(roomId, socket.id, data.message);
  });

  // C. Clear Canvas Event
  socket.on("clear-canvas", () => {
    roomManager.handleClearCanvas(roomId, socket.id);
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
// import jwt from "jsonwebtoken";
// import { JWT_SECRET, WS_PORT } from "@repo/env/common";
// import prisma from "@repo/prisma/prisma";
// import { Server, Socket } from "socket.io";
// import { WORDS, GAME_SETTINGS } from "./constants.js";

// const io = new Server(Number(WS_PORT) || 8080, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"]
//     }
// });

// interface Player {
//     userId: string;
//     username: string;
//     avatarId: number;
//     socketId: string;
//     score: number;
// }

// interface RoomState {
//     roomId: string;
//     slug: string;
//     adminId: string;
//     status: "WAITING" | "STARTING" | "CHOOSING" | "DRAWING" | "FINISHED";
//     players: Player[];
//     currentTurnIndex: number;
//     currentWord: string | null;
//     round: number;
//     timer: NodeJS.Timeout | null;
//     endTime: number | null;
// }

// const rooms = new Map<string, RoomState>();

// // Middleware for authentication
// io.use((socket, next) => {
//     const token = socket.handshake.query.token as string;
//     if (!token) {
//         return next(new Error("Authentication error: No token provided"));
//     }
//     try {
//         const decoded = jwt.verify(token, JWT_SECRET as string) as { userId: string };
//         (socket as any).userId = decoded.userId;
//         next();
//     } catch (e) {
//         return next(new Error("Authentication error: Invalid token"));
//     }
// });

// function get3RandomWords() {
//     const shuffled = [...WORDS].sort(() => 0.5 - Math.random());
//     return shuffled.slice(0, 3);
// }

// function broadcastPlayerUpdate(room: RoomState) {
//     const playerList = room.players.map(p => ({
//         user: {
//             id: p.userId,
//             username: p.username,
//             avatarId: p.avatarId
//         },
//         score: p.score
//     }));
//     io.to(room.roomId).emit("players:update", { players: playerList });
// }

// async function nextTurn(roomId: string) {
//     const room = rooms.get(roomId);
//     if (!room || room.players.length === 0) return;

//     if (room.timer) clearTimeout(room.timer);

//     room.currentTurnIndex++;
//     if (room.currentTurnIndex >= room.players.length) {
//         room.currentTurnIndex = 0;
//         room.round++;
//     }

//     if (room.round > GAME_SETTINGS.ROUNDS) {
//         room.status = "FINISHED";
//         io.to(roomId).emit("game:end", {
//             scores: room.players.map(p => ({
//                 userId: p.userId,
//                 username: p.username,
//                 score: p.score
//             }))
//         });
//         return;
//     }

//     const drawer = room.players[room.currentTurnIndex];
//     if (!drawer) {
//         room.currentTurnIndex = -1;
//         return nextTurn(roomId);
//     }
//     room.status = "CHOOSING";
//     room.currentWord = null;

//     io.to(roomId).emit("game:choosing", {
//         drawerId: drawer.userId,
//         drawerName: drawer.username,
//         round: room.round
//     });

//     // Send 3 words to the drawer
//     const words = get3RandomWords();
//     io.to(drawer.socketId).emit("game:pick_word", { words });

//     // Set timeout if drawer doesn't pick a word
//     room.timer = setTimeout(() => {
//         const randomWord = words[0] || "APPLE";
//         startDrawing(roomId, randomWord);
//     }, GAME_SETTINGS.SELECT_WORD_TIME);
// }

// function startDrawing(roomId: string, word: string) {
//     const room = rooms.get(roomId);
//     if (!room || room.players.length === 0) return;

//     if (room.timer) clearTimeout(room.timer);

//     const drawer = room.players[room.currentTurnIndex];
//     if (!drawer) return nextTurn(roomId);

//     room.status = "DRAWING";
//     room.currentWord = word.toUpperCase();
//     room.endTime = Date.now() + GAME_SETTINGS.DRAW_TIME;

//     io.to(roomId).emit("game:drawing", {
//         wordLength: word.length,
//         endTime: room.endTime,
//         drawerId: drawer.userId
//     });

//     // Send the actual word only to the drawer using socketId
//     io.to(drawer.socketId).emit("game:your_word", { word });

//     room.timer = setTimeout(() => {
//         io.to(roomId).emit("game:round_end", { word: room.currentWord });
//         setTimeout(() => nextTurn(roomId), 3000); // 3 sec pause between turns
//     }, GAME_SETTINGS.DRAW_TIME);
// }

// io.on("connection", (socket: Socket) => {
//     const userId = (socket as any).userId;
//     console.log(`[Socket.IO] User connected: ${userId}`);

//     // CHANGED: 'join' -> 'subscribe'
//     socket.on("subscribe", async ({ slug }) => {
//         try {
//             const roomDb = await prisma.room.findUnique({
//                 where: { slug: slug },
//                 include: { admin: true }
//             });

//             if (!roomDb) {
//                 return socket.emit("error", { message: "Room not found" });
//             }

//             const user = await prisma.user.findUnique({ where: { id: userId } });
//             if (!user) return socket.disconnect();

//             let room = rooms.get(roomDb.id);
//             if (!room) {
//                 console.log(`[WS] Room ${slug} not found in memory, creating new state.`);
//                 room = {
//                     roomId: roomDb.id,
//                     slug: roomDb.slug,
//                     adminId: roomDb.adminId,
//                     status: "WAITING",
//                     players: [],
//                     currentTurnIndex: -1,
//                     currentWord: null,
//                     round: 1,
//                     timer: null,
//                     endTime: null,
//                 };
//                 rooms.set(roomDb.id, room);
//             } else {
//                 console.log(`[WS] Room ${slug} found in memory. Players: ${room.players.length}`);
//             }

//             // Remove existing instances of this user in this room to prevent duplicates
//             room.players = room.players.filter(p => p.userId !== userId);

//             // Add new player
//             room.players.push({
//                 userId,
//                 username: user.username,
//                 avatarId: user.avatarId,
//                 socketId: socket.id,
//                 score: 0
//             });

//             // Socket.IO Join Room
//             socket.join(roomDb.id);
//             (socket as any).roomId = roomDb.id;

//             console.log(`[Socket.IO] ${user.username} subscribed to room ${slug}`);

//             // Broadcast updates
//             broadcastPlayerUpdate(room);
//             io.to(roomDb.id).emit("user:joined", {
//                 username: user.username,
//                 avatarId: user.avatarId,
//             });

//         } catch (err) {
//             console.error("Subscribe Error:", err);
//             socket.emit("error", { message: "Failed to subscribe to room" });
//         }
//     });

//     socket.on("game:start", () => {
//         const roomId = (socket as any).roomId;
//         if (!roomId) return;

//         const room = rooms.get(roomId);
//         if (!room) return;

//         if (room.adminId !== userId) {
//             console.log("Unauthorized game start attempt");
//             return;
//         }

//         if (room.status !== "WAITING") return;

//         console.log(`[Socket.IO] Game started in room ${roomId}`);
//         nextTurn(room.roomId);
//     });

//     socket.on("game:word_selected", ({ word }) => {
//         const roomId = (socket as any).roomId;
//         if (!roomId) return;

//         const room = rooms.get(roomId);
//         if (!room || room.status !== "CHOOSING") return;

//         const drawer = room.players[room.currentTurnIndex];
//         if (!drawer || drawer.userId !== userId) return;

//         startDrawing(room.roomId, word);
//     });

//     socket.on("chat", ({ content }) => {
//         const roomId = (socket as any).roomId;
//         if (!roomId) return;

//         const room = rooms.get(roomId);
//         if (!room) return;

//         const player = room.players.find(p => p.userId === userId);
//         if (!player) return;

//         const guess = content.trim().toUpperCase();
//         const drawer = room.players[room.currentTurnIndex];

//         if (room.status === "DRAWING" && room.currentWord && drawer && player.userId !== drawer.userId) {
//             if (guess === room.currentWord) {
//                 player.score += GAME_SETTINGS.POINTS_PER_GUESS;
//                 drawer.score += GAME_SETTINGS.BONUS_FOR_DRAWER;

//                 io.to(roomId).emit("chat:correct", {
//                     userId: player.userId,
//                     username: player.username,
//                     score: player.score
//                 });

//                 // Update scores for everyone
//                 broadcastPlayerUpdate(room);
//                 return;
//             }
//         }

//         io.to(roomId).emit("chat", {
//             content,
//             username: player.username,
//             avatarId: player.avatarId,
//             userId: player.userId,
//             timestamp: new Date().toISOString(),
//             id: Math.random().toString(36).substr(2, 9)
//         });
//     });

//     socket.on("draw", ({ shape }) => {
//         const roomId = (socket as any).roomId;
//         if (!roomId) return;

//         const room = rooms.get(roomId);
//         if (!room || room.status !== "DRAWING") return;

//         const drawer = room.players[room.currentTurnIndex];
//         // Only allow drawing if it's your turn
//         if (!drawer || drawer.userId !== userId) return;

//         io.to(roomId).emit("draw", { shape });
//     });

//     socket.on("disconnect", () => {
//         const roomId = (socket as any).roomId;
//         console.log(`[Socket.IO] Disconnected: ${userId}`);

//         if (roomId) {
//             const room = rooms.get(roomId);
//             if (room) {
//                 const playerIndex = room.players.findIndex(p => p.userId === userId);
//                 if (playerIndex !== -1) {
//                     const player = room.players[playerIndex];
//                     if (!player) return;

//                     room.players.splice(playerIndex, 1);

//                     io.to(roomId).emit("user:left", { username: player.username });
//                     broadcastPlayerUpdate(room);

//                     if (room.players.length === 0) {
//                         if (room.timer) clearTimeout(room.timer);
//                         rooms.delete(roomId);
//                     } else if (room.status !== "WAITING" && room.currentTurnIndex === playerIndex) {
//                         nextTurn(roomId);
//                     }
//                 }
//             }
//         }
//     });
// });

// console.log(`Socket.IO Server running on port ${WS_PORT || 8080}`);

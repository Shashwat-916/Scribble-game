import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { HTTP_PORT, JWT_SECRET } from "@repo/env/common";
import prisma from "@repo/prisma/prisma";

const app = express();

// --- Middleware ---
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"]
}));

// --- Helper Function ---
const generateSlug = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// =================================================================
// 1. CREATE ROOM
// =================================================================
app.post("/room", async (req, res) => {
    const { username, avatarId } = req.body;

    if (!username) {
        res.status(400).json({ message: "Username is required" });
        return;
    }

    try {
        // Step 1: Create User
        const user = await prisma.user.create({
            data: {
                username,
                avatarId: Number(avatarId) || 1
            }
        });

        // Step 2: Create Room
        const slug = generateSlug();
        const room = await prisma.room.create({
            data: {
                slug,
                adminId: user.id,
                status: "WAITING"
            }
        });

        // Step 3: Link User to Room
        await prisma.user.update({
            where: { id: user.id },
            data: { roomId: room.id }
        });

        // Step 4: Generate Token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET || "secret");

        res.status(201).json({
            message: "Room created",
            token,
            roomId: room.id,
            slug: room.slug
        });

    } catch (e) {
        console.error("Error creating room:", e);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// =================================================================
// 2. JOIN ROOM
// =================================================================
app.post("/join", async (req, res) => {
    const { username, avatarId, slug } = req.body;

    if (!username || !slug) {
        res.status(400).json({ message: "Username and Room ID are required" });
        return;
    }

    try {
        // Step 1: Find Room
        const room = await prisma.room.findUnique({
            where: { slug }
        });

        if (!room) {
            res.status(404).json({ message: "Invalid Room ID" });
            return;
        }

        // Step 2: Create User & Link to Room
        const user = await prisma.user.create({
            data: {
                username,
                avatarId: Number(avatarId) || 1,
                roomId: room.id
            }
        });

        // Step 3: Generate Token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET || "secret");

        res.status(200).json({
            message: "Joined successfully",
            token,
            roomId: room.id,
            slug: room.slug
        });

    } catch (e) {
        console.error("Error joining room:", e);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// =================================================================
// 3. GET ROOM INFO
// =================================================================
app.get("/room/:slug", async (req, res) => {
    const { slug } = req.params;

    try {
        const room = await prisma.room.findUnique({
            where: { slug },
            select: { id: true, status: true, slug: true }
        });

        if (!room) {
            res.status(404).json({ message: "Room not found" });
            return;
        }

        res.json(room);

    } catch (e) {
        console.error("Error fetching room:", e);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// --- Start Server ---
const PORT = HTTP_PORT || 3001;
app.listen(PORT, () => {
    console.log(`HTTP Server running on PORT: ${PORT}`);
});
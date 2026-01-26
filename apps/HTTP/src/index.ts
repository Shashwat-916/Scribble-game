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

    // ------------------------------
    // VALIDATIONS
    // ------------------------------
    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }

    if (username.length < 3 || username.length > 20) {
        return res
            .status(400)
            .json({ message: "Username must be between 3 and 20 characters" });
    }

    // avatarId optional but if present should be valid number
    const parsedAvatarId = Number(avatarId);
    if (avatarId && isNaN(parsedAvatarId)) {
        return res.status(400).json({ message: "Invalid avatarId" });
    }

    try {
        // ------------------------------
        // STEP 1: CREATE USER
        // ------------------------------
        const user = await prisma.user.create({
            data: {
                username,
                avatarId: parsedAvatarId || 1 // default avatar
            }
        });

        // ------------------------------
        // STEP 2: CREATE ROOM
        // ------------------------------
        const slug = generateSlug();

        const room = await prisma.room.create({
            data: {
                slug,
                adminId: user.id,
                status: "WAITING"
            }
        });

        // ------------------------------
        // STEP 3: LINK USER TO ROOM
        // ------------------------------
        await prisma.user.update({
            where: { id: user.id },
            data: { roomId: room.id }
        });

        // ------------------------------
        // STEP 4: GENERATE TOKEN
        // ------------------------------
        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET || "secret",
            { expiresIn: "7d" }
        );

        // ------------------------------
        // RESPONSE
        // ------------------------------
        return res.status(201).json({
            message: "Room created successfully",
            token,
            roomId: room.id,
            slug: room.slug,
            user: {
                id: user.id,
                username: user.username,
                avatarId: user.avatarId
            }
        });

    } catch (e) {
        console.error("Error creating room:", e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


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


app.get("/room/:slug", async (req, res) => {
    const { slug } = req.params;

    try {
        const room = await prisma.room.findUnique({
            where: { slug },
            include: {
                users: {
                    select: {
                        id: true,
                        username: true,
                        avatarId: true
                    }
                }
            }
        });

        if (!room) {
            res.status(404).json({ message: "Invalid Room ID" });
            return;
        }

        res.json(room);

    } catch (e) {
        console.error("Error fetching room:", e);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.listen(HTTP_PORT || 3001, () => {
    console.log(`Server running on port ${HTTP_PORT || 3001}`);
});
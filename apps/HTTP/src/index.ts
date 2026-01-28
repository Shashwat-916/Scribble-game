import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { HTTP_PORT, JWT_SECRET } from "@repo/env/common";
import prisma from "@repo/prisma/prisma";

const app = express();

// --- Middleware ---
app.use(express.json());
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST"],
    })
);

const generateSlug = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// -------------------- CREATE ROOM --------------------
app.post("/room", async (req, res) => {
    try {
        const { username, avatarId } = req.body;

        if (!username || !avatarId) {
            return res.status(400).json({ error: "username and avatarId are required" });
        }

        const slug = generateSlug();

        const user = await prisma.user.upsert({
            where: { username },
            update: { avatarId }, // Update avatar if user exists
            create: { username, avatarId },
        });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET as string, {
            expiresIn: "1h",
        });

        await prisma.room.create({
            data: {
                slug,
                adminId: user.id,
                players: {
                    create: {
                        userId: user.id,
                    },
                },
            },
        });

        res.status(201).json({
            token,
            slug,
            avatarId,
            message: "Room created successfully",
        });
    } catch (error) {
        console.error("CREATE ROOM ERROR:", error);
        res.status(500).json({ error: "Failed to create room" });
    }
});

// -------------------- JOIN ROOM --------------------
app.post("/join", async (req, res) => {
    try {
        const { username, avatarId, slug } = req.body;

        if (!username || !avatarId || !slug) {
            return res
                .status(400)
                .json({ error: "username, avatarId and slug are required" });
        }

        const room = await prisma.room.findUnique({
            where: { slug },
        });

        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        const user = await prisma.user.upsert({
            where: { username },
            update: { avatarId }, // Update avatar if user exists
            create: { username, avatarId },
        });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET as string, {
            expiresIn: "1h",
        });

        await prisma.roomPlayer.create({
            data: {
                userId: user.id,
                roomId: room.id,
            },
        });

        res.json({
            token,
            slug,
            avatarId,
            message: "Joined successfully",
        });
    } catch (error) {
        console.error("JOIN ROOM ERROR:", error);
        res.status(500).json({ error: "Failed to join room" });
    }
});

// -------------------- GET ROOM --------------------
app.get("/room/:slug", async (req, res) => {
    try {
        const { slug } = req.params;

        const room = await prisma.room.findUnique({
            where: { slug },
            include: {
                players: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        res.json(room);
    } catch (error) {
        console.error("GET ROOM ERROR:", error);
        res.status(500).json({ error: "Failed to fetch room" });
    }
});

app.listen(HTTP_PORT || 3001, () => {
    console.log(`Server running on port ${HTTP_PORT || 3001}`);
});

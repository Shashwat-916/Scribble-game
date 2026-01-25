import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET, CreateRoomSchema } from "@repo/env/common";
import { RoomService } from "./RoomService.js";

export class RoomController {
    private roomService: RoomService;

    constructor() {
        this.roomService = new RoomService();
    }

    // POST /room
    createRoom = async (req: Request, res: Response) => {
        // 1. Validation
        const parsed = CreateRoomSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ message: "Invalid inputs" });
            return;
        }

        try {
            // 2. Call Service (Ab ye bina transaction ke chalega)
            const { username, avatarId } = parsed.data;
            const { user, room } = await this.roomService.createRoom(username, avatarId);

            // 3. Generate Token
            const token = jwt.sign({
                userId: user.id,
                roomId: room.id,
                name: user.username
            }, JWT_SECRET ?? "secret");

            // 4. Send Response
            res.status(201).json({
                message: "Room created successfully",
                slug: room.slug,
                roomId: room.id,
                token
            });
        } catch (e) {
            console.error("Error creating room:", e);
            res.status(500).json({ message: "Could not create room" });
        }
    }

    // GET /room/:slug
    getRoom = async (req: Request, res: Response) => {
        try {
            const room = await this.roomService.getRoom(req.params.slug as string);

            if (!room) {
                res.status(404).json({ message: "Room not found" });
                return;
            }

            res.json({
                roomId: room.id,
                slug: room.slug,
                status: room.status
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
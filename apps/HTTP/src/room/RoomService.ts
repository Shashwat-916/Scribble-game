
import prisma from "@repo/prisma/prisma"
import { JWT_SECRET } from "@repo/env/common";

console.log("Prisa", JWT_SECRET)

export class RoomService {

    async createRoom(username: string, avatarId: number) {

        // Step 1: Create the User
        // Pehle user banayenge, abhi uska room null hai
        const user = await prisma.user.create({
            data: {
                username: username,
                avatarId: avatarId,
            }
        });

        // Step 2: Generate Slug
        const slug = this.generateSlug(username);

        // Step 3: Create the Room
        // User ki ID ko adminId bana denge
        const room = await prisma.room.create({
            data: {
                slug: slug,
                adminId: user.id,
                status: "WAITING"
            }
        });

        // Step 4: Update the User
        // Ab User ke andar Room ID dal denge
        await prisma.user.update({
            where: { id: user.id },
            data: { roomId: room.id }
        });

        console.log("User Created:", user.id);
        console.log("Room Created:", room.id);

        return { user, room };
    }

    async getRoom(slug: string) {
        return await prisma.room.findUnique({
            where: { slug },
            select: { id: true, status: true, slug: true }
        });
    }

    async joinRoom(username: string, avatarId: number, slug: string) {
        // 1. Check if room exists
        const room = await prisma.room.findUnique({
            where: { slug: slug }
        });

        if (!room) {
            throw new Error("Room not found");
        }

        // 2. Create User and link to the Room ID
        const user = await prisma.user.create({
            data: {
                username: username,
                avatarId: avatarId,
                roomId: room.id // User joins immediately
            }
        });

        return { user, room };
    }






    private generateSlug(username: string): string {
        const cleanName = username.toLowerCase().replace(/[^a-z0-9]/g, '');
        const randomNum = Math.floor(Math.random() * 10000);
        return `${cleanName}-${randomNum}`;
    }
}
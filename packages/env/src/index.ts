
import { z } from "zod";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from ../.env (relative from dist/index.js)
const envPath = path.resolve(__dirname, "../.env");
console.log(`@repo/env: Loading .env from ${envPath}`);
dotenv.config({ path: envPath });

export const HTTP_PORT = process.env.HTTP_PORT 
export const WS_PORT = process.env.WS_PORT 
export const DATABASE_URL = process.env.DATABASE_URL  
export const JWT_SECRET = process.env.JWT_SECRET



export const CreateRoomSchema = z.object({
    username: z.string().min(3).max(20),
    avatarId: z.number().min(1).max(8) // Because your schema uses Int
});


export const JoinRoomSchema = z.object({
    username: z.string().min(3).max(20),
    avatarId: z.number().min(1).max(8),
    roomId: z.string() // This will accept the "slug" (e.g. cool-tiger-123)
});
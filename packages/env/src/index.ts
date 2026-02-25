
import { z } from "zod";
import dotenv from "dotenv";
dotenv.config()


export const HTTP_PORT = process.env.HTTP_PORT
export const WS_PORT = process.env.WS_PORT
export const JWT_SECRET=process.env.JWT_SECRET



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


const generateSlug: () => string = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};




app.listen(HTTP_PORT || 3001, () => {
    console.log(`Server running on port ${HTTP_PORT || 3001}`);
});
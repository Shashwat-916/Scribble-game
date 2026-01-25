
import cors from "cors"
import express from "express"
import { HTTP_PORT } from "@repo/env/common"
import { RoomController } from "./room/RoomController.js"

const app = express();
app.use(express.json());
app.use(cors({
    origin: "*", // Allow all origins (easiest for dev)
    // OR specific: origin: "http://localhost:3000"
    methods: ["GET", "POST"]
}));

const roomController = new RoomController();


app.post("/room", roomController.createRoom);
app.get("/room/:slug", roomController.getRoom);

console.log(`HTTP_PORT from env: ${HTTP_PORT}`);
app.listen(HTTP_PORT, () => {
    console.log(`HTTP : Server running on PORT :${HTTP_PORT}`);
});
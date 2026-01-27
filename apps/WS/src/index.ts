import jwt from "jsonwebtoken";
import { JWT_SECRET, WS_PORT } from "@repo/env/common";

import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: Number(WS_PORT) || 8080 });


function CheckUser(token: string | null): string | null {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as { userId: string };
    return decoded.userId;
  } catch (e) {
    return null;
  }
}


console.log(`Server running on port ${WS_PORT}`);
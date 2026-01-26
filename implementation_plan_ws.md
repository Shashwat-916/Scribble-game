# IMPL PLAN: Real-time Room Integration

## Goal
Enable real-time features in the Room page: seeing new users join immediately (Leaderboard update) and receiving system broadcasts (Chat).

## Proposed Changes

### Frontend
#### [NEW] [useSocket.ts](file:///d:/SCRIBBLE/apps/web/Hooks/useSocket.ts)
-   **Purpose**: specialized hook for Socket.IO connection.
-   **Logic**:
    -   Connects to `WS_URL` (localhost:8080).
    -   Passes `token` (auth) and `roomId` (query).
    -   Exposes `socket` instance and connection status.
    -   Handles cleanup on unmount.

#### [MODIFY] [page.tsx](file:///d:/SCRIBBLE/apps/web/app/room/[slug]/page.tsx)
-   **Integration**:
    -   Import `useSocket`.
    -   Listen for `user-joined`: Update `players` state.
    -   Listen for `chat-message`: Update `messages` state.
    -   Listen for `user-left`: Update `players` state (remove user).
-   **UX**:
    -   Show "User joined" toast or chat message.

## Verification Plan
### Manual Verification
1.  Open **Tab A** and create a room.
2.  Copy the URL and open **Tab B**.
3.  Join as "Player 2".
4.  **Verify Tab A**:
    -   Leaderboard should instantly show "Player 2".
    -   Chat should show "Player 2 joined" (if backend sends it, otherwise just leaderboard update).
5.  **Verify Tab B**:
    -   Leaderboard should show both players.

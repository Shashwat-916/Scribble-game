# Task: Real-time "User Joined" Broadcast

## Analysis
- [ ] **Analyze Backend**: Read `apps/WS/src` to understand the message format for `join-room` and broadcast events. -> `[IN PROGRESS]`

## Frontend Implementation
- [ ] **Socket Hook**: Create or Update `apps/web/Hooks/useSocket.ts` to handle connection lifecycle.
- [ ] **Integration**: Connect `page.tsx` to the WS server.
    -   Send `join-room` event on mount.
    -   Handle `user-joined` event:
        -   Update `players` list (add new user).
        -   Add "System Message" to Chat ("X joined the room").
- [ ] **Testing**: Verify two tabs update each other.

## Backend Improvements (If needed)
- [ ] **Verify Broadcast**: Ensure `RoomManager` actually broadcasts to *other* users in the room.

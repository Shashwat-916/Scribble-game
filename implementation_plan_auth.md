# IMPL PLAN: Deep Link Auth Flow

## Problem
Users opening a room link (e.g., `.../room/123`) directly in a new session have no Auth Token. The Socket fails to connect (`useSocket` requires token).

## Solution
Force unauthenticated users to go through the Lobby to create a "Guest User" (get a token) before entering the room.

### Frontend Changes

#### 1. [MODIFY] [useLobbyLogic.ts](file:///d:/SCRIBBLE/apps/web/Hooks/useLobbyLogic.ts)
-   **Import**: `useSearchParams` from `next/navigation`.
-   **Logic**:
    -   Read `join` query param.
    -   If present:
        -   `setActiveTab('join')`
        -   `setRoomIdInput(joinParam)`
        -   Toast: "Enter name to join room..."

#### 2. [MODIFY] [page.tsx (Room)](file:///d:/SCRIBBLE/apps/web/app/room/[slug]/page.tsx)
-   **Logic**:
    -   Check `localStorage.getItem("token")` inside a `useEffect`.
    -   If missing: `router.push("/?join=" + slug)`.

## Verification Plan
### Manual
1.  **Clear Storage**: Open a new Incognito window.
2.  **Visit Link**: Go to `http://localhost:3000/room/123` (fake ID).
3.  **Expectation**:
    -   Redirect to `/`.
    -   "Join" tab selected.
    -   Room ID "123" filled in.
4.  **Action**: Enter "Guest", click Join.
5.  **Result**: Redirect back to `/room/123`. Leaderboard shows "Guest". Socket connects.

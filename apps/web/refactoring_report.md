# Refactoring Report: Lobby Component Modularization

## Overview
The main `GlassLobby` component (`apps/web/app/page.tsx`) has been significantly refactored to improve maintainability, readability, and separation of concerns. The monolithic component has been split into a logic hook and several presentational components.

## New Structure

### 1. Logic Separation
**File:** `apps/web/Hooks/useLobbyLogic.ts`

-   **Purpose:** Encapsulates all state management and business logic for the Lobby.
-   **Features:**
    -   State for `activeTab`, `avatarId`, `name`, `roomIdInput`, etc.
    -   `handleSubmit` function for creating or joining rooms.
    -   Countdown timer logic for room redirection.
    -   Clipboard copy functionality.
-   **Benefit:** Keeps the view layer (`page.tsx`) clean and focused purely on UI rendering.

### 2. UI Components (GameScene)
New presentational components have been created in `apps/web/Components/GameScene/`:

#### A. `Lobby.Tab.tsx`
-   **Component:** `LobbyTabs`
-   **Responsibility:** Renders the "Create" vs "Join" tab switcher.
-   **Props:** `activeTab`, `onChange`, `disabled`.

#### B. `PlayerPreview.tsx`
-   **Component:** `PlayerPreview`
-   **Responsibility:** Renders the right-side visualization (Avatar, Name, Status Badge).
-   **Props:** `avatarId`, `name`, `activeTab`, `countdown`.

#### C. `RoomLinkSection.tsx`
-   **Component:** `RoomLinkSection`
-   **Responsibility:** Handles the display of the generated Room Link or the Room ID input field depending on context.
-   **Props:** `slug`, `onCopy`, `isCopied`.

## Updated Main Page
**File:** `apps/web/app/page.tsx`

The `GlassLobby` component is now a pure composition of the above parts:
1.  **Imports:** Uses the new hook and components.
2.  **Hook Usage:** `const { ... } = useLobbyLogic();` retrieves all necessary data and handlers.
3.  **JSX Structure:**
    -   **Layout**: Retains the `glass-card-container` split (Left/Right).
    -   **Composition**:
        -   `<LobbyTabs />`
        -   `<AvatarGrid />` (Existing)
        -   `<RoomLinkSection />`
        -   `<PlayerPreview />`
    -   **Styling**: Continues to use `responsiveCSS` and `app.style.ts`.

## Summary
This modular approach makes the codebase easier to debug and extend. Future features for the Lobby can be added to the specific sub-component or hook without cluttering the main page file.

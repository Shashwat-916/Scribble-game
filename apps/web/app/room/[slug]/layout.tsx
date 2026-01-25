import React from "react";

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        height: "100dvh",
        width: "100%",
        // Hex codes map to: slate-900 -> indigo-950 -> slate-900
        background: "linear-gradient(to bottom right, #0f172a, #1e1b4b, #0f172a)",
        color: "white",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <main
        style={{
          width: "100%",
          height: "100%",
          padding: "16px", // Approximating the padding
          boxSizing: "border-box", // Essential so padding doesn't overflow width
        }}
      >
        {children}
      </main>
    </div>
  );
}
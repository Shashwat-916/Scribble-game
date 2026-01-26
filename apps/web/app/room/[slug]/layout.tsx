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
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#000", // Fallback to black matching page
      }}
    >
      <main
        style={{
          width: "100%",
          height: "100%",
          padding: "0", // Remove padding
        }}
      >
        {children}
      </main>
    </div>
  );
}
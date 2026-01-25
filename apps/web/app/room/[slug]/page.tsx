"use client";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";

export default function RoomPage() {
    const params = useParams();
    const slug = params.slug;

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("No access token found! Redirecting to lobby.");
            window.location.href = "/"; // Go back to lobby
        }

        // TODO: Initialize WebSocket connection here
        console.log("Joining room:", slug, "with token:", token);
    }, [slug]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <h1 className="text-3xl">Welcome to Room: {slug}</h1>
            <p>Connecting to server...</p>
        </div>
    );
}
// hooks/useLobbyLogic.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createRoom, joinRoom } from '../ApiServices/api';

export function useLobbyLogic() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [avatarId, setAvatarId] = useState(1);
  const [name, setName] = useState("");
  const [roomIdInput, setRoomIdInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [createdRoomSlug, setCreatedRoomSlug] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Countdown Effect
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => (c ? c - 1 : 0)), 1000);
      return () => clearTimeout(timer);
    } else if (createdRoomSlug) {
      router.push(`/room/${createdRoomSlug}`);
    }
  }, [countdown, createdRoomSlug, router]);

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error("Please enter a nickname!");
    if (activeTab === 'join' && !roomIdInput.trim()) return toast.error("Please enter a Room ID!");

    setIsLoading(true);

    try {
      if (activeTab === 'create') {
        const data = await createRoom(name, avatarId);
        if (data?.token) localStorage.setItem("token", data.token);
        
        setCreatedRoomSlug(data.slug);
        setIsLoading(false);
        setCountdown(10);
        toast.success("Room Created! Entering in 10s...");
      } else {
        const data = await joinRoom(name, avatarId, roomIdInput);
        if (data?.token) localStorage.setItem("token", data.token);
        toast.success("Joined successfully!");
        router.push(`/room/${data.slug}`);
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!createdRoomSlug) return;
    navigator.clipboard.writeText(createdRoomSlug);
    setIsCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const skipCountdown = () => {
    if (createdRoomSlug) router.push(`/room/${createdRoomSlug}`);
  };

  return {
    // State
    activeTab, setActiveTab,
    avatarId, setAvatarId,
    name, setName,
    roomIdInput, setRoomIdInput,
    isLoading,
    createdRoomSlug,
    countdown,
    isCopied,
    // Handlers
    handleSubmit,
    copyToClipboard,
    skipCountdown
  };
}
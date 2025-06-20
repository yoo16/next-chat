"use client";

import JoinRoomForm from "@/app/components/JoinRoomForm";
import { useLoadingStore } from "@/lib/store/loadingStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function JoinPage() {
    const [error, setError] = useState("");
    const router = useRouter();
    const { setLoading } = useLoadingStore();

    const handleJoinRoom = async (name: string, password: string, room: string) => {
        try {
            setLoading(true);
            const res = await fetch("/api/join", {
                method: "POST",
                body: JSON.stringify({ name, password }),
                headers: { "Content-Type": "application/json" }
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error);
                return;
            }

            localStorage.setItem("next-chat-user-id", data.userId);
            localStorage.setItem("next-chat-token", data.token);
            localStorage.setItem("next-chat-room", room);

            // チャットページへ遷移
            router.push(`/chat/${room}`);
        } catch (err) {
            console.log("Join room error:", err);
            setError("ログインに失敗しました");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <JoinRoomForm onJoin={handleJoinRoom} error={error} />
        </div>
    );
}

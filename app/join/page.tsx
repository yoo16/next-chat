"use client";
import React, { useEffect, useState } from "react";
import JoinRoomForm from "@/app/components/JoinRoomForm";
import { useRouter } from "next/navigation";
import { useAuthUser } from "../components/useAuthUser";

interface User {
    id: number;
    name: string;
    displayName: string;
}

export default function JoinRoomPage() {
    const router = useRouter();
    const [error, setError] = useState("");

    const { user, token } = useAuthUser();
    console.log("Current user:", user);

    if (!user || !token) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500">ログインが必要です</p>
            </div>
        );
    }

    const handleJoin = (user:User, room: string) => {
        console.log("Joining room:", { user, room });
        // 実際の処理に置き換えてください
        localStorage.setItem("next-chat-room", room);

        // チャットページへ遷移
        router.push(`/chat/${room}`);
    };

    return (
        <JoinRoomForm
            onJoin={handleJoin}
            user={user}
            error={error}
        />
    );
}
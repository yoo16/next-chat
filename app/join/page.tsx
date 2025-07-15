"use client";

import React, { useEffect, useState } from "react";
import JoinRoomForm from "@/app/components/JoinRoomForm";
import { useRouter } from "next/navigation";
import { useAuthUser } from "../hooks/useAuthUser";

interface User {
    id: number;
    name: string;
    displayName: string;
}

export default function JoinRoomPage() {
    const router = useRouter();
    const [error, setError] = useState("");

    const { user, token, isLoading } = useAuthUser();

    useEffect(() => {
        if (!isLoading && (!user || !token)) {
            router.push("/login");
        }
    }, [isLoading, user, token, router]);

    if (isLoading) {
        return <div className="text-center py-10 text-gray-500">認証を確認中...</div>;
    }

    if (!user || !token) {
        return null; // push 直前、念のため描画抑止
    }

    const handleJoin = (user: User, room: string) => {
        console.log("Joining room:", { user, room });
        localStorage.setItem("next-chat-room", room);
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

"use client";

import JoinRoomForm from "@/app/components/JoinRoomForm";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function JoinPage() {
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        // ローカルストレージからトークンとユーザIDを取得
        const token = localStorage.getItem("next-chat-token");
        const userId = localStorage.getItem("next-chat-user-id");
        const room = localStorage.getItem("next-chat-room");
        if (token && userId) {
            // トークンとユーザIDが存在する場合はチャットページへリダイレクト
            router.push(`/chat/${room || "a"}`);
        }
    }, [router]);

    const handleJoinRoom = async (name: string, password: string, room: string) => {
        try {
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
            localStorage.setItem("next-chat-name", name);
            localStorage.setItem("next-chat-room", room);

            // チャットページへ遷移
            router.push(`/chat/${room}`);
        } catch (err) {
            console.error("Join room error:", err);
            setError("ログインに失敗しました");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <JoinRoomForm onJoin={handleJoinRoom} error={error} />
        </div>
    );
}

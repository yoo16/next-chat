"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socketClient";
import ChatForm from "@/app/components/ChatForm";
import { Message } from "@/app/interfaces/Message";
import ChatList from "@/app/components/ChatList";

export default function ChatPage() {
    const { room } = useParams<{ room: string }>();
    const search = useSearchParams();
    const router = useRouter();
    const sender =
        search.get("sender") || localStorage.getItem("sender") || "";
    const [userId, setUserId] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (!sender) router.replace("/join");
    }, [sender, router]);

    useEffect(() => {
        socket.emit("join-room", { room, sender });
        socket.on("user-id", setUserId);
        socket.on("message", (data: Message) =>
            setMessages((prev) => [...prev, data])
        );
        socket.on("user-joined", (data: Message) =>
            setMessages((prev) => [...prev, data])
        );
        return () => {
            socket.off("user-id");
            socket.off("message");
            socket.off("user-joined");
        };
    }, [room, sender]);

    // レンダリング後、親コンテナの高さが確定してから末尾までスクロール
    useEffect(() => {
        // 新しいメッセージが来たら window の一番下へスクロール
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    const handleSend = (text: string) => {
        if (!text.trim()) return;
        setMessages((prev) => [...prev, { text, sender, userId }]);
        socket.emit("message", text);
    };

    return (
        <div>
            <div className="fixed top-0 left-0 w-full bg-white z-10">
                <header className="p-4 text-center">
                    <h1 className="text-2xl font-bold">Room {room}</h1>
                    <div className="text-sm mt-1">{sender} さん</div>
                </header>
                <ChatForm onSend={handleSend} />
            </div>

            {/* スクロール領域：window 全体をスクロールさせるならここは余白だけ */}
            <div
                className="pt-[128px] pb-[64px] px-4 space-y-2"
            >
                <ChatList messages={messages} userId={userId} />
            </div>
        </div>
    );
}

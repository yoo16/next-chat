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
    const sender = search.get("sender");
    const [messages, setMessages] = useState<Message[]>([]);
    const [clientId, setClientId] = useState<string>("");

    useEffect(() => {
        if (!sender) router.replace("/join");
    }, [sender, router]);

    useEffect(() => {
        socket.emit("join-room", { room, sender });

        socket.on("client-id", (data) => {
            console.log("Received client ID:", data);
            setClientId(data.clientId);
        });

        socket.on("user-joined", (data) => {
            setMessages(prev => [...prev, data]);
        });

        socket.on("message", (data) => {
            console.log("Received message:", data);
            setMessages(prev => [...prev, data]);
        });

        socket.on("image", (data) => {
            console.log("Received image:", data);
            setMessages(prev => [...prev, data]);
        });

        // クリーンアップ
        return () => {
            socket.off("user-joined");
            socket.off("client-id");
            socket.off("message");
            socket.off("image");
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
        const message = { text, sender, clientId, room };
        // setMessages([...messages, message]);
        socket.emit("message", message);
    };

    const handleSendImage = (imageFile: File) => {
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = () => {
                const buffer = reader.result as ArrayBuffer;
                const message = { buffer, sender, clientId, room };
                console.log("Sending image:", message);
                socket.emit("image", message);
            };
            reader.readAsArrayBuffer(imageFile);
        }
    }

    return (
        <div>
            <div className="fixed top-0 left-0 w-full bg-white z-10">
                <header className="p-4">
                    <div className="text-sm mt-1">
                        <span className="font-bold p-3">Room {room}</span>
                        <span>{sender} さん</span>
                        <span>({clientId})</span>
                    </div>
                </header>
                <ChatForm onSend={handleSend} onSendImage={handleSendImage} />
            </div>

            <div className="pt-[128px] pb-[64px] px-4 space-y-2">
                <ChatList messages={messages} clientId={clientId} />
            </div>
        </div>
    );
}

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getSocket } from "@/lib/socketClient";
import { useRouter, useSearchParams } from "next/navigation";
import JoinRoomForm from "@/app/components/JoinRoomForm";
import ChatForm from "@/app/components/ChatForm";
import ChatList from "@/app/components/ChatList";
import { Message } from "@/app/interfaces/Message";

export default function ChatPage() {
    const search = useSearchParams();
    const router = useRouter();

    const initialSender = search.get("sender") || "";
    const initialRoom = search.get("room") || "";

    const [sender, setSender] = useState<string>(initialSender);
    const [room, setRoom] = useState<string>(initialRoom);
    const [clientId, setClientId] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);

    // sender が決まったら URL を置き換え
    useEffect(() => {
        if (sender && room) {
            router.replace(`/chat?sender=${encodeURIComponent(sender)}&room=${room}`);
        }
    }, [sender, room, router]);

    // sender が決まってから一度だけソケットを作る
    const socket = useMemo(() => {
        if (!sender) return null;
        const s = getSocket(sender);
        return s;
    }, [sender]);

    // room が決まってソケットが準備できたら join してイベント登録
    useEffect(() => {
        if (!socket || !room) return;

        socket.auth = { sender };
        socket.connect();

        socket.emit("join-room", { room });

        socket.on("client-id", data => setClientId(data.clientId));
        socket.on("user-joined", msg => setMessages(m => [...m, msg]));
        socket.on("message", msg => setMessages(m => [...m, msg]));
        socket.on("image", msg => setMessages(m => [...m, msg]));

        return () => {
            socket.off("client-id");
            socket.off("user-joined");
            socket.off("message");
            socket.off("image");
        };
    }, [socket, room]);

    // まだ sender/room がなければ JoinRoomForm
    if (!sender || !room) {
        return (
            <JoinRoomForm
                onJoin={(u, r) => {
                    setSender(u);
                    setRoom(r);
                }}
            />
        );
    }

    // メッセージ送信
    const handleSend = (text: string) => {
        if (!socket) return;
        const message = { text, room, clientId, sender };
        socket.emit("message", message);
    };
    const handleSendImage = (file: File) => {
        if (!socket) return;
        const reader = new FileReader();
        reader.onload = () => {
            const buffer = reader.result as ArrayBuffer;
            const message = { buffer, room, clientId, sender };
            socket.emit("image", message);
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div>
            <div className="fixed top-0 left-0 w-full bg-white z-10">
                <header className="p-4 text-sm">
                    <strong>Room {room}</strong> ｜ {sender} ({clientId})
                </header>
                <ChatForm onSend={handleSend} onSendImage={handleSendImage} />
            </div>
            <div className="pt-[128px] pb-[64px] px-4 space-y-2">
                <ChatList messages={messages} clientId={clientId} />
            </div>
        </div>
    );
}

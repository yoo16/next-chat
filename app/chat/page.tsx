"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getSocket } from "@/lib/socketClient";
import { useSearchParams } from "next/navigation";
import JoinRoomForm from "@/app/components/JoinRoomForm";
import ChatForm from "@/app/components/ChatForm";
import ChatList from "@/app/components/ChatList";
import { Message } from "@/app/interfaces/Message";

export default function ChatPage() {
    const search = useSearchParams();

    const initialSender = search.get("sender") || "";
    const initialRoom = search.get("room") || "";

    const [sender, setSender] = useState<string>(initialSender);
    const [room, setRoom] = useState<string>(initialRoom);
    const [token, setToken] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);

    // sender が決まってから一度だけソケットを作る
    const socket = useMemo(() => {
        if (!sender) return null;
        return getSocket(sender);
    }, [sender]);

    // room / sender が決まってソケットが準備できたら join してイベント登録
    useEffect(() => {
        if (!socket || !room || !sender) return;

        socket.auth = { sender };
        socket.connect();

        socket.emit("join-room", { room, sender });

        socket.on("auth", data => {
            setToken(data.token)
            setUserId(data.userId)
        });
        socket.on("user-joined", msg => setMessages(m => [...m, msg]));
        socket.on("message", msg => setMessages(m => [...m, msg]));
        socket.on("image", msg => setMessages(m => [...m, msg]));

        return () => {
            socket.off("auth");
            socket.off("user-joined");
            socket.off("message");
            socket.off("image");
        };
    }, [socket, room, sender]);

    useEffect(() => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    // token がなければ JoinRoomForm
    if (!token) {
        return (
            <JoinRoomForm onJoin={(u, r) => {
                setSender(u);
                setRoom(r);
            }}
            />
        );
    }

    // メッセージ送信
    const handleSend = (text: string) => {
        const message = { text, room, userId, sender };
        socket?.emit("message", message);
    };
    // 画像送信
    const handleSendImage = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            const buffer = reader.result as ArrayBuffer;
            const message = { buffer, room, userId, sender };
            socket?.emit("image", message);
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div>
            <div className="fixed top-0 left-0 w-full bg-white z-10">
                <header className="p-4 text-sm">
                    <strong>Room {room}</strong> ｜ {sender} ({userId})
                </header>
                <ChatForm onSend={handleSend} onSendImage={handleSendImage} />
            </div>
            <div className="pt-[128px] pb-[64px] px-4 space-y-2">
                <ChatList messages={messages} userId={userId} />
            </div>
        </div>
    );
}

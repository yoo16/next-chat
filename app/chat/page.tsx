"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getSocket } from "@/lib/socketClient";
import { useSearchParams } from "next/navigation";
import JoinRoomForm from "@/app/components/JoinRoomForm";
import ChatForm from "@/app/components/ChatForm";
import ChatList from "@/app/components/ChatList";
import { Message } from "@/app/interfaces/Message";
import e from "cors";

export default function ChatPage() {
    const search = useSearchParams();

    const initialSender = search.get("sender") || "";
    const initialRoom = search.get("room") || "";

    const [socket, setSocket] = useState<any>(null);
    const [sender, setSender] = useState<string>(initialSender);
    const [room, setRoom] = useState<string>(initialRoom);
    const [token, setToken] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const savedToken = localStorage.getItem("next-chat-token");
        const savedSender = localStorage.getItem("next-chat-sender");
        const savedRoom = localStorage.getItem("next-chat-room");

        if (savedToken) setToken(savedToken);
        if (savedSender) setSender(savedSender);
        if (savedRoom) setRoom(savedRoom);
    }, []);

    useEffect(() => {
        if (!sender || !token) return;

        const newSocket = getSocket(sender);
        newSocket.auth = { sender, token };
        newSocket.connect();

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [sender, token]);

    // room / sender が決まってソケットが準備できたら join してイベント登録
    useEffect(() => {
        if (!socket || !room) return;

        socket.emit("join-room", { room, sender });

        socket.on("auth", (data) => {
            setToken(data.token);
            setUserId(data.userId);
            localStorage.setItem("next-chat-token", data.token);
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
    }, [socket, room]);

    useEffect(() => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    const handleJoinRoom = async (u: string, r: string) => {
        setSender(u);
        setRoom(r);

        try {
            const res = await fetch("/api/join", {
                method: "POST",
                body: JSON.stringify({ sender: u, room: r }),
                headers: { "Content-Type": "application/json" }
            });

            if (!res.ok) {
                setError("ログインに失敗しました。");
                return;
            }

            const data = await res.json();
            if (!data.token || !data.userId) {
                setError("ログインに失敗しました。");
                return;
            }

            // localStorage.setItem("next-chat-token", data.token);
            localStorage.setItem("next-chat-token", data.token);
            localStorage.setItem("next-chat-sender", u);
            localStorage.setItem("next-chat-room", r);

            // 状態を更新
            setToken(data.token);
            setUserId(data.userId);
        } catch (err) {
            console.error("Error joining room:", err);
        }
    };

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

    // token がなければ JoinRoomForm を表示
    if (!token) {
        return (
            <JoinRoomForm onJoin={handleJoinRoom} error={error} />
        );
    }

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

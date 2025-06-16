"use client";

import React, { useState, useEffect } from "react";
import { getSocket } from "@/lib/socketClient";
import { useSearchParams } from "next/navigation";
import { Socket } from "socket.io-client";

import JoinRoomForm from "@/app/components/JoinRoomForm";
import ChatForm from "@/app/components/ChatForm";
import ChatList from "@/app/components/ChatList";
import ChatMenu from "@/app/components/ChatMenu";
import { Message } from "@/app/interfaces/Message";
import { AuthUser } from "@/app/interfaces/User";
import { testMessages } from "@/data/TestData";

export default function ChatPage() {
    const search = useSearchParams();

    const initialSender = search.get("sender") || "";
    const initialRoom = search.get("room") || "";
    const [socket, setSocket] = useState<Socket | null>(null);
    const [sender, setSender] = useState<string>(initialSender);
    const [room, setRoom] = useState<string>(initialRoom);
    const [token, setToken] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const savedUserId = localStorage.getItem("next-chat-user-id");
        const savedToken = localStorage.getItem("next-chat-token");
        const savedSender = localStorage.getItem("next-chat-sender");
        const savedRoom = localStorage.getItem("next-chat-room");

        if (savedUserId) setUserId(savedUserId);
        if (savedToken) setToken(savedToken);
        if (savedSender) setSender(savedSender);
        if (savedRoom) setRoom(savedRoom);
    }, []);

    useEffect(() => {
        if (!sender || !token) return;
        // ソケットの初期化
        const newSocket = getSocket(sender);
        newSocket.auth = { sender, token };
        newSocket.connect();

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [sender, token]);

    useEffect(() => {
        if (!socket || !room) return;
        if (process.env.NEXT_PUBLIC_IS_TEST === "true") {
            setMessages(testMessages);
        } else {
            socket.emit("get-history", { room });
            socket.on("history", (msgs: Message[]) => {
                setMessages(msgs);
            });
            return () => {
                socket.off("history");
            };
        }
    }, [socket, room]);

    // room / sender が決まってソケットが準備できたら join してイベント登録
    useEffect(() => {
        if (!socket || !room) return;

        // ルームに参加
        socket.emit("join-room", { room, sender });

        // 認証受信
        socket.on("auth", (data: AuthUser) => {
            setToken(data.token);
            setUserId(data.userId);
            localStorage.setItem("next-chat-token", data.token);
        });

        // ユーザー参加受信
        socket.on("user-joined", (msg: Message) => setMessages(m => [...m, msg]));
        // メッセージ受信
        socket.on("message", (msg: Message) => setMessages(m => [...m, msg]));
        // 画像の受信
        socket.on("image", (msg: Message) => setMessages(m => [...m, msg]));

        return () => {
            socket.off("auth");
            socket.off("user-joined");
            socket.off("message");
            socket.off("image");
        };
    }, [socket, room, sender]);

    useEffect(() => {
        if (messages.length === 0) return;
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    const handleJoinRoom = async (name: string, password: string, room: string) => {
        setSender(name);
        setRoom(room);

        try {
            const res = await fetch("/api/join", {
                method: "POST",
                body: JSON.stringify({ name, password }),
                headers: { "Content-Type": "application/json" }
            });

            const data = await res.json();
            console.log("Join response status:", res.status);
            if (!res.ok) {
                setError(data.error);
                return;
            }

            setError("");

            // ローカルストレージに保存
            localStorage.setItem("next-chat-user-id", data.userId);
            localStorage.setItem("next-chat-token", data.token);
            localStorage.setItem("next-chat-sender", sender);
            localStorage.setItem("next-chat-room", room);

            // 状態を更新
            setToken(data.token);
            setUserId(data.userId);
        } catch (err) {
            console.error("Error joining room:", err);
        }
    };

    // メッセージ送信
    const handleSend = (text: string) => {
        console.log(text, room, userId, sender, token);
        const message = { text, room, userId, sender, token };
        socket?.emit("message", message);
    };

    // 画像送信
    const handleSendImage = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            const buffer = reader.result as ArrayBuffer;
            const message = { buffer, room, userId, sender, token };
            socket?.emit("image", message);
        };
        reader.readAsArrayBuffer(file);
    };

    const handleLogout = () => {
        if (!confirm("ログアウトしますか？")) {
            return;
        }
        // ローカルストレージ削除
        localStorage.removeItem("next-chat-token");
        localStorage.removeItem("next-chat-sender");
        localStorage.removeItem("next-chat-room");

        // 状態のリセット
        setToken("");
        setSender("");
        setRoom("");
        setUserId("");
        setMessages([]);
        setSocket(null);

        // ソケット切断
        if (socket) {
            socket.disconnect();
        }
    };

    // token がなければ JoinRoomForm を表示
    if (!token || !userId || !room) {
        return (
            <div className="min-h-screen bg-gray-50 py-10">
                <JoinRoomForm onJoin={handleJoinRoom} error={error} />
            </div>
        );
    }

    return (
        <div>
            <ChatMenu room={room} sender={sender} onLogout={handleLogout} />

            <div className="pb-[128px] px-4 space-y-2">
                <ChatList messages={messages} userId={userId} />
            </div>

            <div className="fixed bottom-0 left-0 w-full bg-white z-10">
                <ChatForm onSend={handleSend} onSendImage={handleSendImage} />
            </div>
        </div>
    );
}

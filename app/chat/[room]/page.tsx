"use client";

import React, { useState, useEffect } from "react";
import { getSocket } from "@/lib/socketClient";
import { useRouter, useParams } from "next/navigation";
import { Socket } from "socket.io-client";

import ChatForm from "@/app/components/ChatForm";
import ChatList from "@/app/components/ChatList";
import ChatMenu from "@/app/components/ChatMenu";
import { Message } from "@/app/interfaces/Message";
import { AuthUser } from "@/app/interfaces/User";
import { useAuthUser } from "@/app/components/useAuthUser";

export default function ChatPage() {
    const router = useRouter();
    const params = useParams();

    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);

    const room = typeof params.room === "string" ? params.room : "";
    const { user, token, userId } = useAuthUser();

    useEffect(() => {
        if (!user || !token) return;
        // ソケットの初期化
        const newSocket = getSocket(token);
        setSocket(newSocket);
        // ルームに参加
        newSocket.emit("join-room", { room });
    }, [user, token, room]);

    useEffect(() => {
        if (!socket || !room) return;

        // 会話履歴の取得
        // socket.emit("get-history", { room });

        // 認証受信
        socket.on("auth", (data: AuthUser) => {
            if (!data) return;
            console.log("認証成功:", data);
        });

        // ユーザー参加受信
        socket.on("user-joined", (msg: Message) => setMessages(prev => [...prev, msg]));
        // メッセージ受信
        socket.on("message", async (msg: Message) => {
            console.log("メッセージ受信:", msg);
            // api/translate へリクエストを送る
            const res = await fetch("/api/translate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: msg.text,
                    fromLang: "ja",
                    toLang: "en",
                }),
            });
            // JSONレスポンスを取得
            const data = await res.json();
            console.log("翻訳結果:", data);
            const translated = data.translated || "";
            // 翻訳結果をメッセージに追加
            setMessages(prev => [...prev, { ...msg, translated }]);
        });
        // 画像の受信
        socket.on("image", (msg: Message) => setMessages(prev => [...prev, msg]));
        // 履歴の受信
        // socket.on("history", (msgs: Message[]) => {
        //     setMessages(msgs);
        // });

        return () => {
            socket.off("auth");
            socket.off("user-joined");
            socket.off("message");
            socket.off("image");
            socket.off("history");
        };
    }, [user, socket, room]);

    useEffect(() => {
        if (messages.length === 0) return;
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    // メッセージ送信
    const handleSend = (text: string) => {
        const sender = user?.name;
        const message = { text, room, userId, sender, token };
        socket?.emit("message", message);
    };

    // 画像送信
    const handleSendImage = (file: File) => {
        const reader = new FileReader();
        const sender = user?.name;
        reader.onload = () => {
            const buffer = reader.result as ArrayBuffer;
            const message = { buffer, room, userId, sender, token };
            socket?.emit("image", message);
        };
        reader.readAsArrayBuffer(file);
    };

    // ログアウト
    const handleLogout = () => {
        if (!confirm("ログアウトしますか？")) {
            return;
        }
        // ローカルストレージ削除
        localStorage.removeItem("next-chat-user-id");
        localStorage.removeItem("next-chat-token");
        localStorage.removeItem("next-chat-room");

        // 状態のリセット
        setMessages([]);
        setSocket(null);

        // ソケット切断
        if (socket) {
            socket.disconnect();
        }
        // ログイン画面へリダイレクト
        router.push("/join");
    };

    return (
        <div>
            {user && <ChatMenu room={room} user={user} onLogout={handleLogout} />}

            <div className="pb-[128px] px-4 space-y-2">
                {user && <ChatList messages={messages} user={user} />}
            </div>

            <div className="fixed bottom-0 left-0 w-full bg-white z-10">
                <ChatForm onSend={handleSend} onSendImage={handleSendImage} />
            </div>
        </div>
    );
}

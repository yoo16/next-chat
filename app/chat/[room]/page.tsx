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
import { User } from ".prisma/client/default";

export default function ChatPage() {
    const router = useRouter();
    const params = useParams();
    const room = typeof params.room === "string" ? params.room : "";

    const [userInfo, setUserInfo] = useState<User>();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [token, setToken] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const savedToken = localStorage.getItem("next-chat-token");
        const savedUserId = localStorage.getItem("next-chat-user-id");

        if (!savedToken || !savedUserId) {
            router.push("/join");
            return;
        }

        setToken(savedToken);
        setUserId(savedUserId);
    }, [router]);

    useEffect(() => {
        if (!token || !userId) return;

        const fetchUserInfo = async () => {
            try {
                const res = await fetch(`/api/user/me`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                if (!res.ok) {
                    router.push("/join");
                    return;
                }

                const user = await res.json();
                if (!user || user.error) {
                    router.push("/join");
                    return;
                }

                setUserInfo(user);

                const newSocket = getSocket(token);
                setSocket(newSocket);
            } catch (err) {
                console.error("ユーザ情報の取得エラー:", err);
                router.push("/join");
            }
        };

        fetchUserInfo();
    }, [token, userId, router]);

    useEffect(() => {
        if (!socket || !room) return;

        // 会話履歴の取得
        socket.emit("get-history", { room });

        // ルームに参加
        socket.emit("join-room", { room });

        console.log("履歴取得リクエスト:", room);

        // 認証受信
        socket.on("auth", (data: AuthUser) => {
            console.log("認証成功:", data);
            setUserId(data.userId);
        });

        // ユーザー参加受信
        socket.on("user-joined", (msg: Message) => setMessages(m => [...m, msg]));
        // メッセージ受信
        socket.on("message", (msg: Message) => setMessages(m => [...m, msg]));
        // 画像の受信
        socket.on("image", (msg: Message) => setMessages(m => [...m, msg]));
        // 履歴の受信
        socket.on("history", (msgs: Message[]) => {
            setMessages(msgs);
        });

        return () => {
            socket.off("auth");
            socket.off("user-joined");
            socket.off("message");
            socket.off("image");
            socket.off("history");
        };
    }, [socket, room]);

    useEffect(() => {
        if (messages.length === 0) return;
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    // メッセージ送信
    const handleSend = (text: string) => {
        const sender = userInfo?.name;
        const message = { text, room, userId, sender, token };
        socket?.emit("message", message);
    };

    // 画像送信
    const handleSendImage = (file: File) => {
        const reader = new FileReader();
        const sender = userInfo?.name;
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
        setToken("");
        setUserId("");
        setUserInfo({} as User);
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
            {userInfo && <ChatMenu room={room} user={userInfo} onLogout={handleLogout} />}

            <div className="pb-[128px] px-4 space-y-2">
                {userInfo && <ChatList messages={messages} user={userInfo} />}
            </div>

            <div className="fixed bottom-0 left-0 w-full bg-white z-10">
                <ChatForm onSend={handleSend} onSendImage={handleSendImage} />
            </div>
        </div>
    );
}

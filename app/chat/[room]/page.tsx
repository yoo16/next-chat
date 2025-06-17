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
import { testMessages } from "@/data/TestData";
import { User } from ".prisma/client/default";

export default function ChatPage() {
    const router = useRouter();
    const params = useParams();
    const room = typeof params.room === "string" ? params.room : "";

    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [token, setToken] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const savedToken = localStorage.getItem("next-chat-token");
        const savedUserId = localStorage.getItem("next-chat-user-id");
        if (!savedToken || !savedUserId) {
            // トークンがない場合はログイン画面へリダイレクト
            router.push("/join");
            return;
        }
        setToken(savedToken);
        setUserId(savedUserId);

        // ユーザー情報の取得
        const fetchUserInfo = async () => {
            try {
                const res = await fetch(`/api/user/${savedUserId}`, {
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
                setUserInfo(user);
            } catch (err) {
                console.error("ユーザ情報の取得エラー:", err);
                router.push("/join");
            }
        };

        fetchUserInfo();
    }, [room, router, token]);

    useEffect(() => {
        if (!userInfo?.name || !token) return;

        const newSocket = getSocket(userInfo.name);
        newSocket.auth = { token };
        newSocket.connect();

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [userInfo, token]);

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
        socket.emit("join-room", { room, sender: userInfo?.name });

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
    }, [socket, room, userInfo]);

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

    const handleLogout = () => {
        if (!confirm("ログアウトしますか？")) {
            return;
        }
        // ローカルストレージ削除
        localStorage.removeItem("next-chat-user-id");
        localStorage.removeItem("next-chat-token");
        localStorage.removeItem("next-chat-name");
        localStorage.removeItem("next-chat-room");

        // 状態のリセット
        setToken("");
        setUserId("");
        setUserInfo(null);
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
                <ChatList messages={messages} userId={userId} />
            </div>

            <div className="fixed bottom-0 left-0 w-full bg-white z-10">
                <ChatForm onSend={handleSend} onSendImage={handleSendImage} />
            </div>
        </div>
    );
}

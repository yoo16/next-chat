"use client";

import React, { useEffect, useMemo } from "react";
import { getSocket } from "@/lib/socketClient";
import { useRouter, useParams } from "next/navigation";
import { Socket } from "socket.io-client";

import ChatForm from "@/app/components/ChatForm";
import ChatList from "@/app/components/ChatList";
import ChatMenu from "@/app/components/ChatMenu";
import { Message } from "@/app/interfaces/Message";
import { AuthUser } from "@/app/interfaces/User";
import { useAuthUser } from "@/app/hooks/useAuthUser";

export default function ChatPage() {
    const router = useRouter();
    const params = useParams();
    const room = typeof params.room === "string" ? params.room : "";

    const { user, token, isLoading } = useAuthUser();

    const [socket, setSocket] = React.useState<Socket | null>(null);
    const [messages, setMessages] = React.useState<Message[]>([]);

    // ---- 認証チェック & ソケット初期化 ----
    useEffect(() => {
        if (isLoading) return;
        if (!user || !token) {
            router.replace("/join");
            return;
        }
        const s = getSocket(token);
        setSocket(s);
        s.emit("join-room", { room });

        return () => {
            s.off("auth");
            s.off("user-joined");
            s.off("message");
            s.off("image");
            s.off("history");
            s.disconnect();
        };
    }, [isLoading, user, token, room, router]);

    // ---- ソケットイベント購読 ----
    useEffect(() => {
        if (!socket || !room) return;

        const onAuth = (data: AuthUser) => {
            if (!data) return;
            console.log("認証成功:", data);
        };
        const onJoined = (msg: Message) => setMessages(prev => [...prev, msg]);
        const onMessage = (msg: Message) => {
            console.log("メッセージ受信:", msg);
            setMessages(prev => [...prev, msg]);
        };
        const onImage = (msg: Message) => setMessages(prev => [...prev, msg]);

        socket.on("auth", onAuth);
        socket.on("user-joined", onJoined);
        socket.on("message", onMessage);
        socket.on("image", onImage);
        // 履歴を使うなら:
        // socket.emit("get-history", { room });
        // socket.on("history", (msgs: Message[]) => setMessages(msgs));

        return () => {
            socket.off("auth", onAuth);
            socket.off("user-joined", onJoined);
            socket.off("message", onMessage);
            socket.off("image", onImage);
            socket.off("history");
        };
    }, [socket, room]);

    // ---- 自動スクロール ----
    useEffect(() => {
        if (messages.length === 0) return;
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
    }, [messages]);

    // ---- 送信 ----
    const handleSend = (text: string) => {
        if (!user || !token || !socket) return;

        const message: Message = {
            text,
            room,
            userId: user.id,
            sender: user.name,
            token,
            lang: user.lang || "",
        };
        socket.emit("message", message);
        setMessages(prev => [...prev, message]);
    };

    const handleSendImage = (file: File) => {
        if (!user || !token || !socket) return;

        const reader = new FileReader();
        reader.onload = () => {
            const buffer = reader.result as ArrayBuffer;
            const message = { buffer, room, userId: user.id, sender: user.name, token };
            socket.emit("image", message);
        };
        reader.readAsArrayBuffer(file);
    };

    const handleLogout = () => {
        if (!confirm("ログアウトしますか？")) return;

        localStorage.removeItem("next-chat-user-id");
        localStorage.removeItem("next-chat-token");
        localStorage.removeItem("next-chat-room");

        setMessages([]);
        setSocket(prev => {
            prev?.disconnect();
            return null;
        });

        router.push("/join");
    };

    // ローディング中のプレースホルダ（isReady になるまで表示）
    if (isLoading) {
        return <div className="p-6 text-gray-500">読み込み中…</div>;
    }

    // 認証済みでない場合は useEffect が /join に飛ばすのでここには来ない
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
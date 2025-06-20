'use client';

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socketClient";
import { Message } from "@/app/interfaces/Message";
import { AuthUser } from "@/app/interfaces/User";
import { Socket } from "socket.io-client";

export function useChatSocket(token: string, room: string, setMessages: (messages: Message[]) => void, appendMessage: (message: Message) => void): Socket | undefined {
    const [socket, setSocket] = useState<Socket>();

    useEffect(() => {
        const s = getSocket(token);
        setSocket(s);

        console.log("Socket initialized with token:", token);

        return () => {
            s.disconnect();
        };
    }, [token]);

    useEffect(() => {
        if (!socket || !room) return;

        console.log("Joining room:", room);

        socket.emit("join-room", { room });
        socket.emit("get-history", { room });

        socket.on("auth", (data: AuthUser) => {
            console.log("認証成功:", data);
        });
        socket.on("message", appendMessage);
        socket.on("image", appendMessage);
        socket.on("user-joined", appendMessage);
        socket.on("history", (msgs: Message[]) => setMessages(msgs));

        return () => {
            socket.off("auth");
            socket.off("message");
            socket.off("image");
            socket.off("user-joined");
            socket.off("history");
        };
    }, [socket, room, appendMessage, setMessages]);

    return socket;
}
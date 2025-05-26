"use client";

import { useEffect, useState } from 'react';
import ChatForm from "@/app/components/ChatForm";
import { socket } from "@/lib/socketClient";
import { Message } from "@/app/interfaces/Message";
import ChatList from "@/app/components/ChatList";
import JoinRoomForm from "@/app/components/JoinRoomForm";

export default function Home() {
    const [userId, setUserId] = useState("");
    const [room, setRoom] = useState("");
    const [joined, setJoined] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        // サーバーから socket.id を受信して保存
        socket.on("user-id", (id) => {
            setUserId(id);
        });

        socket.on("message", (data) => {
            setMessages((prev) => [...prev, data])
        });

        socket.on("user_joined", (message) => {
            setMessages((prev) => [...prev, { userId, sender: "system", message }])
        });
        return () => {
            socket.off("user-id");
            socket.off("user_joined");
            socket.off("message");
        };
    }, [userId]);

    const handleJoineRoom = (room: string, userName: string) => {
        if (room && userName) {
            setRoom(room)
            setUserName(userName)
            socket.emit("join-room", { room, username: userName })
            setJoined(true);
        }
    }

    const handleSendMessage = (message: string) => {
        const data = { room, message, sender: userName, senderId: userId };
        console.log(data)
        setMessages((prev) => [...prev, { userId, sender: userName, message }])
        socket.emit("message", data);
    }

    return (
        <div className="flex mt-4 justify-center">
            {!joined ? (
                <JoinRoomForm onJoin={handleJoineRoom} />
            ) : (
                <div className="container mx-auto">
                    <h1 className="mb-4 text-center text-2xl font-bold">Room {room}</h1>
                    <div className="text-sm p-3">
                        <span className="">{userName}</span>さん
                    </div>
                    <ChatForm onSendMessage={handleSendMessage} />
                    <ChatList messages={messages} userId={userId} />
                </div>
            )}
        </div>
    );
}

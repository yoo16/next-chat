"use client";
import ChatForm from "@/app/components/ChatForm";
import { useEffect, useState } from 'react';
import { socket } from "@/lib/socketClient";
import { Message } from "@/app/interfaces/Message";
import ChatList from "./components/ChatList";
import JoinRoomForm from "./components/JoinRoomForm";

export default function Home() {
    const [room, setRoom] = useState("");
    const [joined, setJoined] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        socket.on("message", (data) => {
            setMessages((prev) => [...prev, data])
        });

        socket.on("user_joined", (message) => {
            setMessages((prev) => [...prev, { sender: "system", message }])
        });
        return () => {
            socket.off("user_joined");
            socket.off("message");
        };
    }, []);

    const handleJoineRoom = (room: string, userName: string) => {
        if (room && userName) {
            setRoom(room)
            setUserName(userName)
            socket.emit("join-room", { room, username: userName })
            setJoined(true);
        }
    }

    const handleSendMessage = (message: string) => {
        const data = { room, message, sender: userName };
        console.log(data)
        setMessages((prev) => [...prev, { sender: userName, message }])
        socket.emit("message", data);
    }
    return (
        <div className="flex mt-4 justify-center">
            {!joined ? (
                <JoinRoomForm onJoin={handleJoineRoom} />
            ) : (
                <div className="container mx-auto">
                    <h1 className="mb-4 text-2xl font-bold">Room {room}</h1>
                    <div className="text-sm">
                        <span className="">{userName}</span>さん
                    </div>
                    <ChatForm onSendMessage={handleSendMessage} />
                    <ChatList messages={messages} userName={userName} />
                </div>
            )}
        </div>
    );
}

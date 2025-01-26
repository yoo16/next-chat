"use client";
import ChatForm from "@/app/components/ChatForm";
import { useEffect, useState } from 'react';
import ChatMessage from "@/app/components/ChatMessage";
import { socket } from "@/lib/socketClient";

export default function Home() {
    const [room, setRoom] = useState("");
    const [joined, setJoined] = useState(false);
    const [messages, setMessages] = useState<
        { sender: string, message: string }[]
    >([]);
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

    const handleJoineRoom = () => {
        if (room && userName) {
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
                <div>
                    <h2>Join Room</h2>
                    <div className="flex gap-y-2 w-full max-w-3xl mx-auto flex-col items-center">
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="flex-1 px-4 py-2 border-gray-500 border rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="Type room name"
                            value={room}
                            onChange={(e) => setRoom(e.target.value)}
                            className="flex-1 px-4 py-2 border-gray-500 border rounded-lg"
                        />
                        <button
                            onClick={handleJoineRoom}
                            type="submit"
                            className="rounded bg-sky-500 text-white px-4 py-2"
                        >Join</button>
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-3xl mx-auto">
                    <h1 className="mb-4 text-2xl font-bold">Room {room}</h1>
                    <ChatForm onSendMessage={handleSendMessage} />
                    <div className="h-full overflow-y-auto p-4">
                        {messages.map((value, index) => (
                            <ChatMessage
                                key={index}
                                sender={value.sender}
                                message={value.message}
                                isOwnMessage={value.sender === userName}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

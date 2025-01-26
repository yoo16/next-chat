'use client';

import { useEffect, useState } from 'react';
import { socket } from "@/lib/socketClient"

export default function ChatPage() {
    const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        socket.on("user_joined", (message) => {
            setMessages((prev) => [...prev, { sender: "system", message }])
        });
        return () => {
            socket.off("user_joined");
            socket.off("message");
            // socket?.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (socket && input.trim()) {
            socket.emit('message', input);
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-2xl mx-auto bg-gray-100">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        {msg}
                    </div>
                ))}
            </div>
            <div className="flex p-4 bg-white">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type a message..."
                />
                <button
                    onClick={sendMessage}
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
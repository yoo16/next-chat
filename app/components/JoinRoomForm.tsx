import React, { useState } from "react";

interface JoinRoomFormProps {
    onJoin: (username: string, room: string) => void;
}

function JoinRoomForm({ onJoin }: JoinRoomFormProps) {
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("A"); // 初期値は "A"

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username && room) {
            onJoin(room, username);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-y-2 w-full max-w-3xl mx-auto flex-col">
            <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 px-4 py-2 border-gray-500 border rounded-lg"
            />
            <select
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="flex-1 px-4 py-2 border-gray-500 border rounded-lg"
            >
                <option value="A">Room A</option>
                <option value="B">Room B</option>
                <option value="C">Room C</option>
            </select>
            <button
                type="submit"
                className="rounded bg-sky-500 text-white px-4 py-2"
            >
                Join
            </button>
        </form>
    );
};

export default JoinRoomForm;
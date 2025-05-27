import React, { useState } from "react";

interface Props {
    onJoin: (username: string, room: string) => void;
}

export default function JoinRoomForm({ onJoin }: Props) {
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("A");
    const [error, setError] = useState("");

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) {
            setError("ユーザー名を入力してください");
            return;
        }
        setError("");
        onJoin(username.trim(), room);
    };

    return (
        <div className="container mx-auto p-6 max-w-md shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Next Chat</h2>
            <form onSubmit={submit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="ユーザー名"
                    value={username}
                    onChange={e => setUsername(e.currentTarget.value)}
                    className="px-4 py-2 border rounded"
                />
                <select
                    value={room}
                    onChange={e => setRoom(e.currentTarget.value)}
                    className="px-4 py-2 border rounded"
                >
                    <option value="A">Room A</option>
                    <option value="B">Room B</option>
                    <option value="C">Room C</option>
                </select>
                {error && <div className="text-red-600">{error}</div>}
                <button
                    type="submit"
                    className="bg-sky-500 text-white px-4 py-2 rounded"
                >
                    Join
                </button>
            </form>
        </div>
    );
}

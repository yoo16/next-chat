import React, { useState } from "react";
import { rooms, RoomOption } from '@/app/data/rooms'

interface Props {
    onJoin: (username: string, room: string) => void;
}

export default function JoinRoomForm({ onJoin }: Props) {
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState(rooms[0].value);
    const [error, setError] = useState("");

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username) {
            setError("ユーザー名を入力してください");
            return;
        }
        onJoin(username, room);
        setError("");
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
                    {rooms.map((r: RoomOption) => (
                        <option key={r.value} value={r.value}>
                            {r.label}
                        </option>
                    ))}
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

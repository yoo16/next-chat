import React, { useState } from "react";
import { rooms, RoomOption } from "@/data/rooms";

interface Props {
    onJoin: (name: string, password: string, room: string) => void;
    error?: string;
}

export default function JoinRoomForm({ onJoin, error: externalError }: Props) {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [room, setRoom] = useState(rooms[0].value);
    const [localError, setLocalError] = useState("");

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !password) {
            setLocalError("ユーザー名とパスワードを入力してください");
            return;
        }

        // エラーがなければクリア
        setLocalError("");
        onJoin(name, password, room);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-4 text-center">Next Chat</h2>
            <form onSubmit={submit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="ユーザー名"
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                    className="px-4 py-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    className="px-4 py-2 border rounded"
                />
                <select
                    value={room}
                    onChange={(e) => setRoom(e.currentTarget.value)}
                    className="px-4 py-2 border rounded"
                >
                    {rooms.map((r: RoomOption) => (
                        <option key={r.value} value={r.value}>
                            {r.label}
                        </option>
                    ))}
                </select>

                {(localError || externalError) && (
                    <div className="text-red-600">{localError || externalError}</div>
                )}

                <button type="submit" className="bg-sky-500 text-white px-4 py-2 rounded">
                    Join
                </button>
            </form>
        </div>
    );
}

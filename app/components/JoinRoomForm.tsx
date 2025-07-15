"use client";
import React, { useState } from "react";
import { rooms, RoomOption } from "@/app/data/rooms";
import { useAuthUser } from "../hooks/useAuthUser";
import { User } from "@prisma/client";

interface Props {
    onJoin: (user:User, room: string) => void;
    user: User;
    error?: string;
}

export default function JoinRoomForm({ onJoin, user, error, }: Props) {
    const [room, setRoom] = useState(rooms[0].value);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        onJoin(user, room);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-4 text-center">Next Chat</h2>

            <form onSubmit={submit} className="flex flex-col gap-4">

                <div className="text-sm text-gray-700">
                    <span className="font-bold">{user?.name}</span>
                </div>

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

                {error && <div className="text-red-600 text-sm">{error}</div>}

                <button
                    type="submit"
                    className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition"
                >
                    Join
                </button>
            </form>
        </div>
    );
}
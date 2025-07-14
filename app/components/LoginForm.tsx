"use client";
import React, { useState } from "react";
import { rooms, RoomOption } from "@/app/data/rooms";

interface Props {
    onAuth: (name: string, password: string) => void;
    error?: string;
}

export default function LoginForm({ onAuth, error }: Props) {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !password) {
            alert("ユーザー名とパスワードを入力してください");
            return;
        }
        onAuth(name, password);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-4 text-center">Next Chat</h2>

            <form onSubmit={submit} className="flex flex-col gap-4">

                <>
                    <input
                        type="text"
                        placeholder="ユーザー名"
                        value={name}
                        onChange={e => setName(e.currentTarget.value)}
                        className="px-4 py-2 border rounded"
                    />
                    <input
                        type="password"
                        placeholder="パスワード"
                        value={password}
                        onChange={e => setPassword(e.currentTarget.value)}
                        className="px-4 py-2 border rounded"
                    />
                </>

                {error && <div className="text-red-600 text-sm">{error}</div>}

                <button
                    type="submit"
                    className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
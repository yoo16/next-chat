'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/regist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sender: name,
                password,
                displayName,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "登録に失敗しました");
            return;
        }

        localStorage.setItem("next-chat-token", data.token);
        localStorage.setItem("next-chat-sender", name);

        router.push(`/chat?sender=${encodeURIComponent(name)}`);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
            <h1 className="text-2xl font-bold mb-4">ユーザー登録</h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <label className="block mb-2 text-sm">ユーザーID</label>
            <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full border px-3 py-2 mb-4 rounded"
            />

            <label className="block mb-2 text-sm">表示名</label>
            <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="w-full border px-3 py-2 mb-4 rounded"
            />

            <label className="block mb-2 text-sm">パスワード</label>
            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border px-3 py-2 mb-6 rounded"
            />

            <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600">
                登録する
            </button>
        </form>
    );
}
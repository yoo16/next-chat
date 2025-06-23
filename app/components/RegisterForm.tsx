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
                name,
                password,
                displayName,
            }),
        });

        if (!res.ok) {
            setError("登録に失敗しました");
            return;
        }

        const data = await res.json();
        console.log("Response data:", data);
        if (data.error) {
            setError(data.error);
            return;
        }
        if (!data.userId || !data.token) {
            setError("登録に失敗しました");
            return;
        }

        console.log("New user created:", data);

        // ローカルストレージにユーザー情報を保存
        localStorage.setItem("next-chat-user-id", data.userId);
        localStorage.setItem("next-chat-token", data.token);
        localStorage.setItem("next-chat-sender", name);

        // チャット画面にリダイレクト
        router.push('/join');
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
            <form onSubmit={handleSubmit}>
                <h1 className="text-center text-2xl font-bold mb-4">ユーザー登録</h1>

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
        </div>
    );
}
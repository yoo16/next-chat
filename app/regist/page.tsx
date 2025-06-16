'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegistPage() {
    const [sender, setSender] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleRegister = async () => {
        setError("");

        const res = await fetch("/api/regist", {
            method: "POST",
            body: JSON.stringify({ sender }),
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "登録失敗");
            return;
        }

        // チャット画面にリダイレクト（クエリで渡すか状態管理で渡す）
        router.push(`/chat?sender=${encodeURIComponent(sender)}`);
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
            <h1 className="text-xl font-bold mb-4">ユーザ登録</h1>
            <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="ユーザ名を入力"
                className="w-full border px-3 py-2 rounded mb-4"
            />
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <button
                onClick={handleRegister}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                登録する
            </button>
        </div>
    );
}
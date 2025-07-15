'use client';

import { User } from "@prisma/client";
import { useEffect, useState } from "react";

export function useAuthUser() {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("next-chat-token");
        if (!token) {
            setIsLoading(false);
            return;
        }

        fetch("/api/user/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.ok ? res.json() : Promise.reject())
            .then((data) => {
                setUser(data);
                setToken(token);
            })
            .catch(() => {
                localStorage.removeItem("next-chat-token");
                setUser(null);
                setToken(null);
            })
            .finally(() => setIsLoading(false)); // ← 完了時に解除
    }, []);

    return { user, token, isLoading };
}
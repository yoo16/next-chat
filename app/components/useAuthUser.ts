'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from ".prisma/client/default";
// import { useLoadingStore } from "@/lib/store/loadingStore";

export function useAuthUser() {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState("");
    const [userId, setUserId] = useState("");
    const router = useRouter();
    // const { setLoading } = useLoadingStore();

    useEffect(() => {
        const savedToken = localStorage.getItem("next-chat-token");
        const savedUserId = localStorage.getItem("next-chat-user-id");

        if (!savedToken || !savedUserId) {
            router.push("/join");
            return;
        }

        setToken(savedToken);
        setUserId(savedUserId);
    }, [router]);

    useEffect(() => {
        if (!token || !userId) return;

        const fetchUser = async () => {
            try {
                const res = await fetch("/api/user/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                console.log("useAuthUser effect triggered", { token, userId });
                console.log("Fetched user data:", data);
                if (!res.ok || data.error) {
                    router.push("/join");
                } else {
                    setUser(data);
                }
            } finally {
            }
        };

        fetchUser();
    }, [token, userId, router]);

    return { user, token, userId };
}
"use client";
import React, { useEffect, useState } from "react";
import JoinRoomForm from "@/app/components/JoinRoomForm";
import { useRouter } from "next/navigation";
import LoginForm from "../components/LoginForm";

interface User {
    id: number;
    name: string;
    displayName: string;
}

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");

    const handleAuth = async (name: string, password: string) => {
        console.log("Authenticating user:", { name, password });
        try {
            const response = await fetch("/api/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, password }),
            });
            if (!response.ok) {
                throw new Error("Authentication failed");
            }
            const data = await response.json();
            localStorage.setItem("next-chat-token", data.token);
            localStorage.setItem("next-chat-user-id", data.userId);
            router.push('/join/');
        } catch (error) {
            console.error("Error during authentication:", error);
            setError("ログインに失敗しました");
        }
    };

    return (
        <LoginForm
            onAuth={handleAuth}
            error={error}
        />
    );
}
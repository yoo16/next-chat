"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavBar() {
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("next-chat-token");
        setIsAuthenticated(!!token);
        console.log(token)
    }, []);

    const linkClass = (path: string) =>
        `px-4 py-2 rounded hover:bg-sky-200 transition ${pathname === path ? "font-bold" : ""}`;

    return (
        <nav className="bg-white shadow p-4 flex justify-between items-center">
            <div className="text-xl font-bold text-sky-700">
                <Link href="/">Next Chat</Link>
            </div>
            <div className="space-x-4">
                {!isAuthenticated && (
                    <Link href="/regist" className={linkClass("/regist")}>
                        ユーザ登録
                    </Link>
                )}
                <Link href="/chat" className={linkClass("/chat")}>
                    チャット
                </Link>
            </div>
        </nav>
    );
}
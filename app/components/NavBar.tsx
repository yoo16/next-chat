"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME } from "@/lib/constants";

export default function NavBar() {
    const pathname = usePathname();

    const linkClass = (path: string) =>
        `px-4 py-2 rounded ${pathname === path ? "font-bold" : ""}`;

    return (
        <nav className="bg-white shadow p-4 flex justify-between items-center">
            <div className="text-xl font-bold text-sky-700">
                <Link href="/">{APP_NAME}</Link>
            </div>
            <div className="space-x-4">
                <Link href="/regist" className={linkClass("/regist")}>
                    ユーザ登録
                </Link>
                <Link href="/login" className={linkClass("/login")}>
                    ログイン
                </Link>
                <Link href="/join" className={linkClass("/join")}>
                    チャットに参加
                </Link>
                <Link href="/user" className={linkClass("/user")}>
                    ユーザ情報
                </Link>
            </div>
        </nav>
    );
}
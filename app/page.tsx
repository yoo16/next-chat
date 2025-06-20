import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export default function HomePage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-sky-400 p-6">
            <div className="text-center space-y-6">
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800">
                    ようこそ、{APP_NAME} へ！
                </h1>
                <p className="text-lg md:text-xl text-gray-600">
                    友達・チーム・AIとチャットしよう
                </p>
                <div className="space-x-4">
                    <Link href="/regist"
                        className="px-6 py-3 bg-sky-600 text-white rounded-xl shadow hover:bg-sky-700 transition">
                        ユーザ登録
                    </Link>
                    <Link href="/chat"
                        className="px-6 py-3 bg-sky-600 text-white rounded-xl shadow hover:bg-sky-700 transition">
                        チャットに参加
                    </Link>
                </div>
            </div>
        </main>
    );
}

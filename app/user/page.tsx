'use client';

import Link from "next/link";
import Image from "next/image";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { useAuthUser } from "@/app/components/useAuthUser";
import { useRouter } from "next/navigation";

export default function UserPage() {
    const router = useRouter();
    const { user, token, userId } = useAuthUser();
    console.log('UserDetailPage useAuthUser effect triggered', { user, token, userId });

    if (!user) {
        return (
            <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
                <p className="text-center text-gray-500">ユーザーデータを取得中...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
            {user.image && (
                <div className="m-4">
                    <div className="rounded-full overflow-hidden w-32 h-32 mx-auto">
                        <Image
                            src={user.image}
                            alt={`${user.displayName}`}
                            width={128}
                            height={128}
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>

            )}

            <div className="space-y-2">
                <p><span className="font-semibold">ユーザー名：</span>{user.name}</p>
                <p><span className="font-semibold">表示名：</span>{user.displayName}</p>
                <p><span className="font-semibold">プロフィール：</span>{user.profile || "（未設定）"}</p>
                <p><span className="font-semibold">言語：</span>{user.lang || "（未設定）"}</p>
            </div>
            <div className="mt-6 text-center">
                <Link href='/user/edit' className="bg-sky-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                    編集
                </Link>
            </div>
        </div>
    );
}
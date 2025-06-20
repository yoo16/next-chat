import { prisma } from "@/lib/prisma";
import Link from "next/dist/client/link";
import Image from "next/image";

export default async function UserDetailPage({ params }: { params: { id: string } }) {
    const userId = Number(params.id);
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        return <div className="text-center mt-10 text-red-600">ユーザーが見つかりません</div>;
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
                <p className="text-sm text-gray-500">登録日時: {user.createdAt.toLocaleString()}</p>
            </div>
            <div className="mt-6 text-center">
                <Link href={`/user/${user.id}/edit`} className="bg-sky-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                    編集
                </Link>
            </div>
        </div>
    );
}
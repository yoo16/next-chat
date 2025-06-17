import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    context: { params: { id: string } }
) {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return NextResponse.json({ error: "認証トークンが必要です" });
    }
    console.log("Received token:", token);

    const userId = Number(context.params.id);
    if (isNaN(userId)) {
        return NextResponse.json({ error: "無効なユーザーIDです" });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            displayName: true,
            profile: true,
            image: true,
            lang: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) {
        return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
    }

    return NextResponse.json(user);
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const userId = Number(params.id);

    if (isNaN(userId)) {
        return NextResponse.json({ error: "無効なユーザーIDです" }, { status: 400 });
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
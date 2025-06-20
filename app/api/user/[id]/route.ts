import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(req: Request, context: { params: { id: string } }) {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
    const JWT_SECRET = process.env.JWT_SECRET!;

    console.log("Received token:", token);

    try {
        jwt.verify(token, JWT_SECRET);
    } catch (err) {
        console.error("JWT verification failed:", err);
        return NextResponse.json({ error: "認証エラー" }, { status: 401 });
    }

    const userId = Number(context.params.id);
    if (isNaN(userId)) {
        return NextResponse.json({ error: "無効なユーザーIDです" });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
        },
    });

    if (!user) {
        return NextResponse.json({ error: "ユーザーが見つかりません" });
    }

    return NextResponse.json(user);
}

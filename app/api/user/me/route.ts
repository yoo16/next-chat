import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "") ?? "";

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                displayName: true,
                profile: true,
                image: true,
                lang: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (err) {
        console.error("JWT verification failed:", err);
        return NextResponse.json({ error: "認証エラー" }, { status: 401 });
    }
}

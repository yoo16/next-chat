import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
    console.log("Received token:", token);

    try {
        // トークンを検証
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

        const { name,
            displayName,
            profile,
            lang,
            image,
        } = await req.json();

        const id = decoded.userId;
        console.log("post data", 
            { id, name, displayName, profile, lang, image }
        );
        // ユーザー情報を更新
        const user = await prisma.user.update({
            where: { id: id },
            data: {
                name,
                displayName,
                profile,
                lang,
            },
            select: {
                id: true,
                name: true,
                displayName: true,
            },
        });

        return NextResponse.json({ user });
    } catch (error) {
        console.error("認証エラー:", error);
        return NextResponse.json({ error: "無効なトークンです" }, { status: 401 });
    }
}

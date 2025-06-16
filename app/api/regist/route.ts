import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
    const { sender, password, displayName } = await req.json();

    if (!sender || sender.trim() === "") {
        return NextResponse.json({ error: "Sender required" }, { status: 400 });
    }

    if (!password || password.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // ユーザー名の重複チェック
    const existing = await prisma.user.findUnique({ where: { name: sender } });
    if (existing) {
        return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    // パスワードのハッシュ化
    const hashedPassword: string = await bcrypt.hash(password, 10);

    // users テーブルに新しいユーザーを作成
    const user = await prisma.user.create({
        data: {
            name: sender,
            password: hashedPassword,
            displayName: displayName,
        },
    });

    const token = jwt.sign(
        { userId: user.id, sender: user.name },
        JWT_SECRET,
        { expiresIn: "1h" }
    );

    return NextResponse.json({ userId: user.id, token });
}
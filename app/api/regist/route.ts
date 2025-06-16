import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
    const { name, password, displayName } = await req.json();

    // ユーザー名の重複チェック
    const existing = await prisma.user.findUnique({ where: { name } });
    if (existing) {
        return NextResponse.json({ error: "そのユーザはすでに登録されています" });
    }

    // パスワードのハッシュ化
    const hashedPassword: string = await bcrypt.hash(password, 10);

    // users テーブルに新しいユーザーを作成
    const user = await prisma.user.create({
        data: {
            name: name,
            password: hashedPassword,
            displayName: displayName,
        },
    });

    console.log("New user created:", user);

    const token = jwt.sign(
        { userId: user.id, sender: user.name },
        JWT_SECRET,
        { expiresIn: "1h" }
    );

    return NextResponse.json({ userId: user.id, token });
}
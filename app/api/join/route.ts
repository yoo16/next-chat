import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
    const { sender } = await req.json();

    if (!sender || sender.trim() === "") {
        return NextResponse.json({ error: "Sender required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { name: sender },
    });

    if (!user) {
        return NextResponse.json({ error: "ユーザ名またはパスワードが間違っています" });
    }

    console.log("User found:", user);

    // JWT 生成
    const token = jwt.sign(
        {
            userId: user.id,
            sender: user.name,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
    );

    return NextResponse.json({
        token,
        userId: user.id,
    });
}
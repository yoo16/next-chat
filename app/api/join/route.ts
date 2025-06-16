import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
    const { name, password } = await req.json();

    const user = await prisma.user.findUnique({
        where: { name },
    });

    console.log(name, password);
    if (user) {
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return NextResponse.json({ error: "ユーザ名またはパスワードが間違っています" }, { status: 401 });
        }

        // ✅ JWT 生成
        const token = jwt.sign(
            { userId: user.id, sender: user.name, },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        return NextResponse.json({
            token,
            userId: user.id,
        });
    }

    return NextResponse.json({ error: "ユーザ名またはパスワードが間違っています" }, { status: 401 });
}
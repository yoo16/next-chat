import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const { sender } = await req.json();

    // ユーザ作成（存在すればスキップ）
    let user = await prisma.user.findUnique({
        where: { name: sender },
    });

    if (!user) {
        user = await prisma.user.create({
            data: { name: sender },
        });
    }

    const token = uuidv4(); // ここも JWT などに変更可能

    return NextResponse.json({
        token,
        userId: user.id,
    });
}
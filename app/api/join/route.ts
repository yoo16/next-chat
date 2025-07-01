export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// import { cookies } from "next/headers";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET || "default_refresh_secret";

console.log("JWT_SECRET:", JWT_SECRET);
console.log("REFRESH_SECRET:", REFRESH_SECRET);
// アクセストークン（短命）
function generateAccessToken(payload: { userId: number; name: string }) {
    return jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: "7d" }
    );
}

// リフレッシュトークン（長命）
function generateRefreshToken(payload: { userId: number; name: string }) {
    return jwt.sign(
        payload, 
        REFRESH_SECRET, 
        { expiresIn: "30d" }
    );
}

export async function POST(req: Request) {
    const { name, password } = await req.json();

    const user = await prisma.user.findUnique({
        where: { name },
    });

    if (!user) {
        return NextResponse.json(
            { error: "ユーザ名またはパスワードが間違っています" },
            { status: 401 }
        );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return NextResponse.json(
            { error: "ユーザ名またはパスワードが間違っています" },
            { status: 401 }
        );
    }

    const payload = { userId: user.id, name: user.name };

    // JWT トークン生成
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    console.log("アクセストークン:", accessToken);
    console.log("リフレッシュトークン:", refreshToken);
    // DB にリフレッシュトークン保存
    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });

    // TODO: Cookie にリフレッシュトークンを保存
    // cookies().set("refreshToken", refreshToken, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "lax",
    //     maxAge: 60 * 60 * 24 * 30, // 30日
    //     path: "/",
    // });
    
    // アクセストークンはJSONで返す
    return NextResponse.json({
        token: accessToken,
        userId: user.id,
    });
}
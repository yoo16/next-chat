import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const form = await req.formData();

    const name = form.get('name')?.toString() || '';
    const displayName = form.get('displayName')?.toString() || '';
    const profile = form.get('profile')?.toString() || '';
    const lang = form.get('lang')?.toString() || '';
    const imageFile = form.get('image') as File | null;

    // 画像の保存（バイナリを保存）
    let imageFileName = "";
    if (imageFile) {
        imageFileName = `${Date.now()}-${imageFile.name}`;
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fs = require('fs');
        // public/uploads ディレクトリを作成していない場合は作成
        if (!fs.existsSync('./public/uploads')) {
            fs.mkdirSync('./public/uploads', { recursive: true });
        }
        const path = `./public/uploads/${imageFileName}`;
        fs.writeFileSync(path, buffer);
        // path をDBに保存するなど
    }

    // Prismaで更新（例）
    const image = imageFile ? `/uploads/${imageFileName}` : undefined;
    await prisma.user.update({
        where: { id: Number(params.id) },
        data: { name, displayName, profile, lang, image },
    });

    return NextResponse.json({ success: true });
}

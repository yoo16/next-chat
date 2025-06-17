import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const id = Number(params.id);
    const data = await req.json();

    console.log('Received data:', id, data);
    try {
        await prisma.user.update({
            where: { id },
            data,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: '更新に失敗しました' }, { status: 500 });
    }
}
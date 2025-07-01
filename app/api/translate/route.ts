import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
        return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const body = await req.json();
    const { text, fromLang, toLang } = body;

    if (!text || !fromLang || !toLang) {
        return NextResponse.json({ error: 'パラメータを指定してください' }, { status: 400 });
    }

    const prompt = `以下の文を${fromLang}から${toLang}に翻訳してください。\n\n"${text}"`;

    const contents = [
        {
            parts: [{ text: prompt }],
        },
    ];

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-pro',
            config: { responseMimeType: 'text/plain' },
            contents,
        });

        const translated = response.candidates?.[0]?.content?.parts?.[0]?.text || 'It seems that the translation failed.';

        return NextResponse.json({ translated });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: '翻訳に失敗しました' }, { status: 500 });
    }
}

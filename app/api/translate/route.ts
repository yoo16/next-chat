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

    console.log('Received translation request:', { text, fromLang, toLang });

    // const data = {
    //     text,
    //     translated: 'Hello, world!', // Placeholder for translation result
    //     fromLang,
    //     toLang,
    // }
    // return NextResponsejson(data);

    if (!text || !fromLang || !toLang) {
        return NextResponse.json({ error: 'パラメータを指定してください' }, { status: 400 });
    }
    if (fromLang === toLang) {
        return NextResponse.json({ error: '翻訳元と翻訳先の言語が同じです' }, { status: 400 });
    }

    const prompt = `次の文を${fromLang}から${toLang}に、短く正確に1文だけで翻訳して(エラー、解説、補足は不要)。\n\n"${text}"`;

    const contents = [
        {
            parts: [{ text: prompt }],
        },
    ];

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            config: { responseMimeType: 'text/plain' },
            contents,
        });

        const translated = response.candidates?.[0]?.content?.parts?.[0]?.text || 'It seems that the translation failed.';
        const data = {
            text,
            translated,
            fromLang,
            toLang,
        }
        console.log('Translation result:', data);
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: '翻訳に失敗しました' }, { status: 500 });
    }
}

import React from 'react'
import Sender from '@/app/components/Sender';
import { Message } from '@/app/interfaces/Message';
import { User } from '@prisma/client';
import { FiVolume2 } from 'react-icons/fi';
import { MdTranslate } from 'react-icons/md';

interface Props {
    message: Message;
    user: User;
}

export default function ChatText({ message, user }: Props) {
    const isOwnMessage = message.userId == user.id;
    const chatStyle = isOwnMessage ? "bg-sky-500 text-white" : "bg-gray-100 text-gray-600";
    const [translated, setTranslated] = React.useState<string>("");

    const handleTranslate = async () => {
        if (!message.text || !message.lang) return;
        if (user?.lang !== message.lang) {
            const data = {
                text: message.text,
                fromLang: message.lang,
                toLang: user?.lang,
            }
            const res = await fetch("/api/translate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                // 翻訳結果をメッセージに追加
                const data = await res.json();
                console.log("翻訳結果:", data);
                setTranslated(data.translated || "");
            }
        }
    }

    const handleSpeak = () => {
        const utterance = new SpeechSynthesisUtterance(message.text);
        if (!message.lang) {
            return;
        }
        utterance.lang = message.lang;

        // 利用可能なvoiceを設定
        const voices = window.speechSynthesis.getVoices();
        const matchedVoice = voices.find(v => v.lang === utterance.lang);
        if (matchedVoice) {
            utterance.voice = matchedVoice;
        }

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div>
            <Sender message={message} />
            <div className={`max-w-xs px-4 py-2 rounded-lg ${chatStyle}`}>
                {message.text}
                {!isOwnMessage && message.lang &&
                    <div>
                        <button
                            onClick={handleSpeak}
                            className="p-2 text-white border rounded bg-sky-400"
                        >
                            <FiVolume2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleTranslate}
                            className="p-2 ml-2 border rounded text-white bg-sky-400"
                        >
                            <MdTranslate className="w-4 h-4" />
                        </button>
                        {translated &&
                            <p className="py-2 text-gray-600 font-bold">{translated}</p>
                        }
                    </div>
                }
            </div>
        </div>
    )
}

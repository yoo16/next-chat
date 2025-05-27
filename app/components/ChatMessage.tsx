import { Message } from '@/app/interfaces/Message';
import React from 'react'
import Image from 'next/image';
import Sender from './Sender';

interface ChatMessageProps {
    message: Message;
    clientId: string;
}

function ChatMessage({ message, clientId }: ChatMessageProps) {
    const isOwnMessage = message.clientId === clientId;
    const image = message.buffer ? URL.createObjectURL(new Blob([message.buffer])) : null;

    const dateFormat = (isoDate: string) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        };
        const dateString = date.toLocaleDateString('ja-JP', options);
        return dateString.replace(/\//g, '-').replace(',', '');
    }

    return (
        <div className={`flex mb-3 ${isOwnMessage ? "justify-start" : "justify-end"}`}>
            {image && (
                <div>
                    <Sender message={message} />
                    <div className="max-w-xs">
                        <Image
                            src={image}
                            alt="User uploaded"
                            width={300}
                            height={200}
                            className="rounded-lg mb-2"
                        />
                    </div>
                </div>
            )}
            {message.text && (
                <div>
                    <Sender message={message} />
                    <div className={`max-w-xs px-4 py-2 rounded-lg
                    ${isOwnMessage ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600"
                        }`}>
                        {message.text}
                    </div>
                    <span className="text-xs text-gray-400">{message.date && dateFormat(message.date)}</span>
                </div>
            )}
        </div>
    )
}

export default ChatMessage
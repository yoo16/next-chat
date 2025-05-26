import { Message } from '@/app/interfaces/Message';
import React from 'react'
import Image from 'next/image';

interface ChatMessageProps {
    message: Message;
    clientId: string;
}

function ChatMessage({ message, clientId }: ChatMessageProps) {
    const isOwnMessage = message.clientId === clientId;
    const image = message.buffer ? URL.createObjectURL(new Blob([message.buffer])) : null;
    return (
        <div className={`flex mb-3 ${isOwnMessage ? "justify-start" : "justify-end"}`}>
            {image && (
                <div className="max-w-xs">
                    <Image
                        src={image}
                        alt="User uploaded"
                        width={300}
                        height={200}
                        className="rounded-lg mb-2"
                    />
                </div>
            )}
            {message.text && (
                <div className={`max-w-xs px-4 py-2 rounded-lg mb-3
                    ${isOwnMessage ? "bg-green-500 text-white" : "bg-gray-100 text-black"
                    }`}>
                    <div className="tex-xs py-1" data-client-id={message.clientId}>{message.sender}</div>
                    <div>{message.text}</div>
                </div>
            )}
        </div>
    )
}

export default ChatMessage
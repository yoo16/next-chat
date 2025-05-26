import { Message } from '@/app/interfaces/Message';
import React from 'react'

interface ChatMessageProps {
    message: Message;
    userId: string;
}

function ChatMessage({ message, userId }: ChatMessageProps) {
    const isSystemMessage = message.sender === "system";
    const isOwnMessage = message.userId === userId;
    return (
        <div className={`flex ${isSystemMessage
            ? "justify-center"
            : isOwnMessage
                ? "justify-start"
                : "justify-end"
            } mb-3`}>
            <div className="rounded-full bg-skey-500 w-6 h-6"></div>
            <div className={`max-w-xs px-4 py-2 rounded-lg 
            ${isSystemMessage
                    ? "bg-gray-800 text-white text-center text-xs"
                    : isOwnMessage
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-black"
                } mb-3`}>
                {!isSystemMessage && <p className="tex-xs" data-user-id={message.userId}>{message.sender}</p>}
                <p>{message.text}</p>
            </div>
        </div>
    )
}

export default ChatMessage
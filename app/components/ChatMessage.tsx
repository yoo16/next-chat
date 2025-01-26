import React from 'react'

interface ChatMessageProps {
    userId: string;
    sender: string;
    message: string;
    isOwnMessage: boolean;
}

function ChatMessage({ userId, sender, message, isOwnMessage }: ChatMessageProps) {
    const isSystemMessage = sender === "system";
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
                        ? "bg-sky-500 text-white"
                        : "bg-gray-100 text-black"
                } mb-3`}>
                {!isSystemMessage && <p className="tex-xs" data-user-id={userId}>{sender}</p>}
                <p>{message}</p>
            </div>
        </div>
    )
}

export default ChatMessage
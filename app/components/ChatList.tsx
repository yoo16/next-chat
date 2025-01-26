import React from 'react'
import ChatMessage from '@/app/components/ChatMessage'
import { Message } from '@/app/interfaces/Message';

interface ChatListProps {
    messages: Message[];
    userName: string;
}

function ChatList({ messages, userName }: ChatListProps) {
    return (
        <div className="h-full overflow-y-auto p-4">
            {messages.map((value, index) => (
                <ChatMessage
                    key={index}
                    sender={value.sender}
                    message={value.message}
                    isOwnMessage={value.sender === userName}
                />
            ))}
        </div>
    )
}

export default ChatList
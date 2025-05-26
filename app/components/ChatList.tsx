import React from 'react'
import ChatMessage from '@/app/components/ChatMessage'
import { Message } from '@/app/interfaces/Message';

interface ChatListProps {
    messages: Message[];
    userId: string;
}

function ChatList({ messages, userId }: ChatListProps) {
    return (
        <div className="h-full overflow-y-auto p-4">
            {messages.map((message, index) => (
                <ChatMessage
                    key={index}
                    message={message}
                    userId={userId}
                />
            ))}
        </div>
    )
}

export default ChatList
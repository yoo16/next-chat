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
            {messages.map((value, index) => (
                <ChatMessage
                    key={index}
                    userId={value.userId}
                    sender={value.sender}
                    message={value.message}
                    isOwnMessage={value.userId === userId}
                />
            ))}
        </div>
    )
}

export default ChatList
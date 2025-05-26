import React from 'react'
import ChatMessage from '@/app/components/ChatMessage'
import { Message } from '@/app/interfaces/Message';

interface ChatListProps {
    messages: Message[];
    clientId: string;
}

function ChatList({ messages, clientId }: ChatListProps) {
    return (
        <div className="h-full overflow-y-auto p-4">
            {messages.map((message, index) => (
                <ChatMessage
                    key={index}
                    message={message}
                    clientId={clientId}
                />
            ))}
        </div>
    )
}

export default ChatList
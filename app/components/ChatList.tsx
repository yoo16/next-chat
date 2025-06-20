import React from 'react'
import ChatMessage from '@/app/components/ChatMessage'
import { Message } from '@/app/interfaces/Message';
import { User } from '@prisma/client';

interface Props {
    messages: Message[];
    user: User;
}

function ChatList({ messages, user }: Props) {
    return (
        <div className="h-full overflow-y-auto p-4">
            {messages.map((message, index) => (
                <ChatMessage
                    key={index}
                    message={message}
                    user={user}
                />
            ))}
        </div>
    )
}

export default ChatList
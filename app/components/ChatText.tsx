import React from 'react'
import Sender from '@/app/components/Sender';
import { Message } from '@/app/interfaces/Message';
import { User } from '@prisma/client';

interface Props {
    message: Message;
    user: User;
}

export default function ChatText({ message, user }: Props) {
    const isOwnMessage = message.userId == user.id;
    const chatStyle = isOwnMessage ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600";

    return (
        <div>
            <Sender message={message} />
            <div className={`max-w-xs px-4 py-2 rounded-lg ${chatStyle}`}>
                {message.text}

                {!isOwnMessage && message.translated && 
                    <p className="py-2 text-gray-600 font-bold">{message.translated}</p>
                }
            </div>
        </div>
    )
}

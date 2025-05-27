import React from 'react'
import { Message } from '@/app/interfaces/Message';

interface Props {
    message: Message;
}

export default function Sender({ message }: Props) {
    if (!message) return;
    return (
        <div className="text-gray-500 py-1" data-user-id={message.userId}>
            <span className="p-1 text-sm">{message.sender}</span>
        </div>
    )
}

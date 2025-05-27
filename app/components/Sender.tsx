import React from 'react'
import { Message } from '@/app/interfaces/Message';

interface SenderProps {
    message: Message;
}

export default function Sender({ message }: SenderProps) {
    if (!message) return;
    return (
        <div className="text-gray-500 py-1" data-client-id={message.clientId}>
            <span className="p-1 text-sm">{message.sender}</span>
        </div>
    )
}

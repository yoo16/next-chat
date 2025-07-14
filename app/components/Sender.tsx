import React from 'react'
import { Message } from '@/app/interfaces/Message';
import { dateFormat } from '@/lib/date';

interface Props {
    message: Message;
}

export default function Sender({ message }: Props) {
    console.log("Sender component rendered with message:", message);
    if (!message) return;
    return (
        <div className="text-gray-500 py-1">
            <span className="p-1 text-sm">{message.sender}</span>
            <span className="text-xs text-gray-400">{message.date && dateFormat(message.date)}</span>
        </div>
    )
}

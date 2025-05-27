import React from 'react'
import Image from 'next/image';
import Sender from './Sender';
import { Message } from '@/app/interfaces/Message';
import { dateFormat } from '@/lib/date';

interface Props {
    message: Message;
}

export default function ChatImage({ message }: Props) {
    const image = message.buffer ? URL.createObjectURL(new Blob([message.buffer])) : null;
    if (!image) return null;

    return (
        <div>
            <Sender message={message} />
            <div className="max-w-xs">
                <Image
                    src={image}
                    alt="User uploaded"
                    width={200}
                    height={200}
                    className="rounded-lg mb-2"
                />
                <span className="text-xs text-gray-400">{message.date && dateFormat(message.date)}</span>
            </div>
        </div>
    )
}

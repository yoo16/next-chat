import { Message } from '@/app/interfaces/Message';
import React from 'react'
import ChatImage from './ChatImage';
import ChatText from './ChatText';
interface Props {
    message: Message;
    userId: string;
}

function ChatMessage({ message, userId }: Props) {
    const isOwnMessage = message.userId === userId;
    const image = message.buffer ? URL.createObjectURL(new Blob([message.buffer])) : null;

    return (
        <div className={`flex mb-3 ${isOwnMessage ? "justify-end" : "justify-start"}`}>
            {image && <ChatImage message={message} />}
            {message.text && ChatText({ message, userId })}
        </div>
    )
}

export default ChatMessage
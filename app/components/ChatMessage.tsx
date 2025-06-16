import { Message } from '@/app/interfaces/Message';
import React from 'react'
import ChatImage from './ChatImage';
import ChatText from './ChatText';
interface Props {
    message: Message;
    userId: string;
}

function ChatMessage({ message, userId }: Props) {
    const image = message.buffer ? URL.createObjectURL(new Blob([message.buffer])) : null;

    return (
        <div className={`flex mb-3`}>
            {image && <ChatImage message={message} />}
            {message.text && <ChatText message={message} userId={userId} />}
        </div>
    )
}

export default ChatMessage
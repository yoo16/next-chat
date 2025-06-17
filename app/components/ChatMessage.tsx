import { Message } from '@/app/interfaces/Message';
import React from 'react'
import ChatImage from './ChatImage';
import ChatText from './ChatText';
import { User } from '@prisma/client';
interface Props {
    message: Message;
    user: User;
}

function ChatMessage({ message, user }: Props) {
    const image = message.buffer ? URL.createObjectURL(new Blob([message.buffer])) : null;

    return (
        <div className={`flex mb-3`}>
            {image && <ChatImage message={message} />}
            {message.text && <ChatText message={message} user={user} />}
        </div>
    )
}

export default ChatMessage
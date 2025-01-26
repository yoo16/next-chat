"use client";

import React, { FormEvent, useState } from 'react'

const ChatForm = ({
    onSendMessage,
}: {
    onSendMessage: (message: string) => void
}) => {
    const [message, setMessage] = useState("");

    function handleSubmit(e: FormEvent): void {
        e.preventDefault();
        if (message.trim() !== "") {
            onSendMessage(message);
            setMessage("");
        }
        console.log("Submitted")
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex gap-2 mt-4" method="post">
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    type="text"
                    className="flex-1 px-4 border-gray-500 border-2 py-2 rounded-lg"
                    placeholder="Type your message here..."
                />
                <button
                    type="submit"
                    className="rounded bg-sky-500 text-white px-4 py-2"
                >Send
                </button>
            </form>
        </div>
    )
}

export default ChatForm
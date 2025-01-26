"use client";

import React, { FormEvent, useState } from "react";

const ChatForm = ({
    onSendMessage,
}: {
    onSendMessage: (message: string) => void;
}) => {
    const [message, setMessage] = useState("");

    function handleSubmit(e: FormEvent): void {
        e.preventDefault();
        if (message.trim() !== "") {
            onSendMessage(message);
            setMessage("");
        }
        console.log("Submitted");
    }

    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <form
                onSubmit={handleSubmit}
                className="flex items-center gap-4"
                method="post"
            >
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    type="text"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Type your message here..."
                />
                <button
                    type="submit"
                    className="px-4 py-2 text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition duration-200"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatForm;
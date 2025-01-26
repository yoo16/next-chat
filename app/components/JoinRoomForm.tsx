import React, { useState } from "react";

interface JoinRoomFormProps {
    onJoin: (username: string, room: string) => void;
}

function JoinRoomForm({ onJoin }: JoinRoomFormProps) {
    const [errorMessage, setErrorMessage] = useState("");
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("A"); // 初期値は "A"

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username && room) {
            onJoin(room, username);
        } else {
            setErrorMessage("Please, enter username");
        }
    };

    return (
        <div className="container mx-auto shadow-lg p-6 max-w-md">
            <h2 className="p-5 text-2xl text-center font-bold">Next Chat</h2>
            <form onSubmit={handleSubmit} className="flex gap-y-2 w-full max-w-3xl mx-auto flex-col">
                <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 px-4 py-2 border-gray-300 border rounded-lg"
                />
                <select
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="flex-1 px-4 py-2 border-gray-300 border rounded-lg"
                >
                    <option value="A">Room A</option>
                    <option value="B">Room B</option>
                    <option value="C">Room C</option>
                </select>

                {errorMessage &&
                    <div className="py-2 px-4 text-sm bg-red-200 text-red-600 rounded-lg">
                        {errorMessage}
                    </div>
                }
                <button
                    type="submit"
                    className="mt-2 rounded bg-sky-500 text-white px-4 py-2"
                >
                    Join
                </button>
            </form>
        </div>
    );
};

export default JoinRoomForm;
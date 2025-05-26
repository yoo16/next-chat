"use client";
import React, { FormEvent, useState, ChangeEvent, useRef } from "react";
import Image from "next/image";

type ChatFormProps = {
    onSend: (message: string) => void;
    onSendImage: (imageFile: File) => void;
};

const ChatForm = ({ onSend, onSendImage }: ChatFormProps) => {
    const [message, setMessage] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    // ここで input の DOM を参照できるように
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setMessage(e.target.value);
    }

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (message.trim()) {
            onSend(message.trim());
            setMessage("");
        }

        if (image) {
            onSendImage(image);
            // プレビュー URL を解放
            if (preview) {
                URL.revokeObjectURL(preview);
                setPreview(null);
            }
            setImage(null);

            // ★ファイル入力をクリア！
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }

    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex items-center gap-4">
                    <input
                        value={message}
                        onChange={handleChange}
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
                    <label className="px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                            ref={fileInputRef}            // ← here
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        Image
                    </label>
                </div>

                {preview && (
                    <Image
                        src={preview}
                        alt="preview"
                        className="w-16 h-16 object-cover rounded"
                        width={64}
                        height={64}
                    />
                )}
            </form>
        </div>
    );
};

export default ChatForm;

"use client";

import React, { FormEvent, useState, ChangeEvent, useRef } from "react";
import Image from "next/image";
import { useSpeechRecognition } from "@/app/hooks/useSpeechRecognition";

type ChatFormProps = {
    onSend: (message: string) => void;
    onSendImage: (imageFile: File) => void;
};

const ChatForm = ({ onSend, onSendImage }: ChatFormProps) => {
    const [text, setText] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    // 音声認識
    const { listening, toggleListening } = useSpeechRecognition((transcript) => {
        setText((prev) => prev + transcript);
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleCancelImage = () => {
        if (!preview) return;
        URL.revokeObjectURL(preview);
        setPreview(null);
        setImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (text.trim()) {
            onSend(text.trim());
            setText("");
        }

        if (image) {
            onSendImage(image);
            if (preview) {
                URL.revokeObjectURL(preview);
                setPreview(null);
                setImage(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        }
    };

    return (
        <div className="p-4 rounded-lg shadow-md">
            {preview && (
                <div className="flex justify-center p-6">
                    <div>
                        <button
                            type="button"
                            onClick={handleCancelImage}
                            className="text-sm text-red-500 px-2 py-1"
                        >
                            ✖
                        </button>
                        <Image
                            src={preview}
                            alt="preview"
                            className="w-32 h-32 object-cover rounded"
                            width={128}
                            height={128}
                        />
                    </div>
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex items-center gap-2">
                    <input
                        value={text}
                        onChange={handleChange}
                        type="text"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="Type or speak your message..."
                    />
                    <button
                        type="submit"
                        className="px-3 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition duration-200"
                    >
                        Send
                    </button>
                    <button
                        type="button"
                        onClick={toggleListening}
                        className={`px-3 py-2 rounded-lg border ${listening ? "bg-red-100 border-red-400" : "bg-white border-gray-300"
                            } hover:bg-gray-50 transition`}
                        title="音声入力"
                    >
                        🎤
                    </button>
                    <label className="px-3 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        📷
                    </label>
                </div>
            </form>
        </div>
    );
};

export default ChatForm;
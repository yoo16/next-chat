"use client";
import React, { FormEvent, useState, ChangeEvent, useRef } from "react";
import Image from "next/image";

type ChatFormProps = {
    onSend: (message: string) => void;
    onSendImage: (imageFile: File) => void;
};

const ChatForm = ({ onSend, onSendImage }: ChatFormProps) => {
    const [text, setText] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    // ここで input の DOM を参照できるように
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setText(e.target.value);
    }

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
    }

    function handleCancelImage() {
        if (!preview) return;
        URL.revokeObjectURL(preview);
        setPreview(null);
        setImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (text.trim()) {
            // テキスト送信
            onSend(text.trim());
            // テキスト入力をクリア
            setText("");
        }

        if (image) {
            // 画像送信
            onSendImage(image);
            // 画像のプレビューをクリア
            if (preview) {
                URL.revokeObjectURL(preview);
                setPreview(null);
                setImage(null);
                // ファイル入力をクリア
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        }
    }

    return (
        <div className="p-4 rounded-lg shadow-md">
            {preview && (
                <div className="flex justify-center p-6">
                    <div>
                        <button
                            type="button"
                            onClick={handleCancelImage}
                            className="text-sm text-red-500 px-2 py-1"
                        >✖
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
                <div className="flex items-center gap-4">
                    <input
                        value={text}
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
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        Image
                    </label>
                </div>

            </form>
        </div>
    );
};

export default ChatForm;

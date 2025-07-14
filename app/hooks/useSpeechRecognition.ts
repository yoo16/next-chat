import { useRef, useState } from "react";

export const useSpeechRecognition = (
    onResult: (transcript: string) => void
) => {
    const [listening, setListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const initRecognition = (): SpeechRecognition | null => {
        const SpeechRecognitionClass =
            typeof window !== "undefined" &&
            (window.SpeechRecognition || window.webkitSpeechRecognition);

        if (!SpeechRecognitionClass) {
            alert("このブラウザは音声認識に対応していません。");
            return null;
        }

        const recognition = new SpeechRecognitionClass();
        recognition.lang = localStorage.getItem("next-chat-lang") || "ja-JP";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = event.results[0][0].transcript;
            onResult(transcript);
        };

        recognition.onstart = () => setListening(true);
        recognition.onend = () => setListening(false);
        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error("音声認識エラー:", event.error);
            setListening(false);
        };

        return recognition;
    };

    const startListening = () => {
        if (!recognitionRef.current) {
            recognitionRef.current = initRecognition();
        }

        recognitionRef.current?.start();
    };

    const stopListening = () => {
        recognitionRef.current?.stop();
    };

    const toggleListening = () => {
        if (listening) {
            stopListening();
        } else {
            startListening();
        }
    };

    return {
        listening,
        startListening,
        stopListening,
        toggleListening,
    };
};

"use client";
import { useRouter } from "next/navigation";
import JoinRoomForm from "@/app/components/JoinRoomForm";

export default function JoinPage() {
    const router = useRouter();
    const handleJoin = (room: string, sender: string) => {
        // ローカルストレージや Cookie に sender を保存しておくとリロード時に便利
        localStorage.setItem("sender", sender);
        router.push(`/chat/${room}?sender=${encodeURIComponent(sender)}`);
    };
    return <JoinRoomForm onJoin={handleJoin} />;
}
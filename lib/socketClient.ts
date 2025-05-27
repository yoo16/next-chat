"use client";

import { io, Socket } from "socket.io-client";

// console.log(process.env.NEXT_PUBLIC_SOCKET_URL)
const SOCKET_URL =
    process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001";

let socket: Socket;

export function getSocket(sender: string): Socket {
    if (!socket) {
        socket = io(SOCKET_URL!, {
            auth: { sender },
            autoConnect: false,
        });
    }
    // sender が変わるたびにハンドシェイクし直したいなら disconnect → connect。
    if (socket && (socket.auth as { sender: string }).sender !== sender) {
        socket.auth = { sender };
        socket.disconnect();
    }
    socket.connect();
    return socket;
}
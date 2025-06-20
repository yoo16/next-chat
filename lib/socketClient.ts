"use client";

import { io, Socket } from "socket.io-client";

// console.log(process.env.NEXT_PUBLIC_SOCKET_URL)
const SOCKET_URL =
    process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001";

let socket: Socket;

export function getSocket(token: string): Socket {
    console.log("Connecting to socket with token:", token);
    if (!socket) {
        socket = io(SOCKET_URL!, {
            auth: { token },
            // TODO: ここでwithCredentialsをtrueにすると、CORSの問題が発生する可能性がある
            // withCredentials: true,
            autoConnect: false,
        });
    }
    socket.connect();
    return socket;
}
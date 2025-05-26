"use client";

import { io } from "socket.io-client";

// console.log(process.env.NEXT_PUBLIC_SOCKET_URL)
const SOCKET_URL =
    process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001";

export const socket = io(SOCKET_URL);
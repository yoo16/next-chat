'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER || 'http://localhost:3001';

export default function VideoChat({ token, room }: { token: string; room: string }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerRef = useRef<RTCPeerConnection | null>(null);

    useEffect(() => {
        const s = io(SERVER_URL, {
            auth: { token },
        });

        setSocket(s);

        s.on('connect', () => {
            console.log('Connected:', s.id);
            s.emit('join-room', { room });
        });

        s.on('webrtc-offer', async ({ from, offer }) => {
            const peer = createPeer(false, s, from);
            await peer.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            s.emit('webrtc-answer', { to: from, answer });
        });

        s.on('webrtc-answer', async ({ answer }) => {
            await peerRef.current?.setRemoteDescription(new RTCSessionDescription(answer));
        });

        s.on('webrtc-ice-candidate', ({ candidate }) => {
            if (candidate) {
                peerRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        return () => {
            s.disconnect();
        };
    }, [token, room]);

    useEffect(() => {
        if (!socket) return;

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;

            const peer = createPeer(true, socket);
            stream.getTracks().forEach(track => peer.addTrack(track, stream));
        });
    }, [socket]);

    const createPeer = (isCaller: boolean, socket: Socket, targetId?: string) => {
        const peer = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });

        peer.onicecandidate = ({ candidate }) => {
            if (candidate && targetId) {
                socket.emit('webrtc-ice-candidate', { to: targetId, candidate });
            }
        };

        peer.ontrack = event => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        peerRef.current = peer;

        if (isCaller && targetId) {
            peer.createOffer().then(offer => {
                peer.setLocalDescription(offer);
                socket.emit('webrtc-offer', { to: targetId, offer });
            });
        }

        return peer;
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-1/2 rounded shadow" />
            <video ref={remoteVideoRef} autoPlay playsInline className="w-1/2 rounded shadow" />
        </div>
    );
}

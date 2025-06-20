export interface Message {
    room?: string;
    userId?: number;
    text: string;
    buffer?: ArrayBuffer;
    sender: string;
    date?: string;
}
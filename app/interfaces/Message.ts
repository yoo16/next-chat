export interface Message {
    room?: string;
    userId?: number;
    text: string;
    translated?: string;
    buffer?: ArrayBuffer;
    sender: string;
    date?: string;
}
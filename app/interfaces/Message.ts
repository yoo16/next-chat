export interface Message {
    room?: string;
    clientId?: string;
    text: string;
    buffer?: ArrayBuffer;
    sender: string;
    date?: string;
}
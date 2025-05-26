export interface Message {
    room?: string;
    userId?: string;
    text: string;
    sender: string;
}
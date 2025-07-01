export interface AuthUser {
    userId: string;
    name: string;
    token: string;
    password?: string;
    profile?: string;
    image?: string;
    lang?: string;
}
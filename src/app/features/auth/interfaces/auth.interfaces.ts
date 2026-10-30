export interface Auth {
    email: string;
    password:  string;
}

export interface AuthResponse {
    ok: boolean,
    token?: string;
    user?:  User;
    error?: string;
}

export interface User {
    uuid: string;
    email: string;
    id: number,
    name: string;
    slug: string;
    role: string;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
    password_confirmation: string;
}
export interface DataLogin {
    email: string;
    password: string;
}

export interface DataRegister {
    name: string;
    email: string;
    password: string;
}

export interface InforUser {
    id: number;
    accessToken: string,
    email: string,
    name: string,
    avatar: string,
    created_at: string,
    updated_at: string
}
import { Request } from "express";

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userName: string;
    profilePhoto?: string | null;
    coverPhoto?: string | null;
    bio?: string | null;
    location?: string | null;
    bikeDetails?: string | null;
}

export interface RegisterUserRequest extends Request {
    body: UserData;
}

export interface AuthRequest extends Request {
    auth: {
        sub: string;
        email: string;
        id?: string;
    };
}

export type AuthCookie = {
    accessToken: string;
    refreshToken: string;
};

export interface IRefreshTokenPayload {
    id: string;
}

export interface LimitedUserData {
    firstName: string;
    lastName: string;
    userName: string;
    profilePhoto?: string;
    coverPhoto?: string;
    bio?: string;
    location?: string;
    bikeDetails?: string;
}

export interface UpdateUserRequest extends Request {
    body: LimitedUserData;
}

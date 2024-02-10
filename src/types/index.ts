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
    email?: string;
    bio?: string;
    location?: string;
    bikeDetails?: string;
}

export interface UpdateUserRequest extends Request {
    body: LimitedUserData;
}

export interface ItineraryData {
    tripTitle: string;
    tripDescription: string;
    tripDuration: string;
    startDateTime: string;
    endDateTime: string;
    startPoint: string;
    endingPoint: string;
    destinationImage: string;
    userId: number;
}

export interface ItineraryRequestData extends Request {
    body: ItineraryData;
}

export interface MemoryData {
    title: string;
    description: string;
    image?: string;
    userId: number;
    likes?: [];
    comments?: [];
}

export interface MemoryRequestData extends Request {
    body: MemoryData;
}

export interface UpdateMemoriesData {
    title?: string;
    description?: string;
    image?: string | null;
}

export interface UpdateMemoriesRequestData extends Request {
    body: UpdateMemoriesData;
}

export interface UpdateItineraryData {
    tripTitle?: string;
    tripDescription?: string;
    tripDuration?: string;
    startDateTime?: string;
    endDateTime?: string;
    startPoint?: string;
    endingPoint?: string;
    destinationImage?: string;
}

export interface UpdateItineriesRequestData extends Request {
    body: UpdateItineraryData;
}

export interface JoinItinerariesData {
    userId: number;
}

export interface JoinItinerariesRequestData extends Request {
    body: JoinItinerariesData;
}

export interface UserRelationshipData {
    followerId: number;
    followedId: number;
}

export interface UserRelationshipRequestData extends Request {
    body: UserRelationshipData;
}

export interface CommentData {
    text: string;
    userId: number;
    memoryId: number;
}

export interface CommentRequestData extends Request {
    body: CommentData;
}

export interface QueryParams {
    q: string;
}

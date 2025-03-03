export interface ConferenceRoom {
    id?: number;
    name: string;
}

export interface User {
    id?: number;
    name: string;
}

export interface Reservation {
    id?: number;
    name: string,
    conferenceRoomId: number;
    participantIds: number[];
    startTime: Date;
    endTime: Date;
}

export interface APIResponse {
    message?: string;
    error?: string;
}
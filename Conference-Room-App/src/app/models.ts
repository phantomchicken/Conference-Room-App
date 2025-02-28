export interface ConferenceRoom {
    id: number;
    name: string;
}

export interface User {
    id: number;
    name: string;
}

export interface Reservation {
    id?: number;
    conferenceRoomId: number;
    participantIds: number[];
    startDate?: Date;
}
  
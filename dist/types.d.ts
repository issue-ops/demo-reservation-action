import { RoomAmenity, RoomType } from './enums.js';
/** Action Inputs */
export type ActionInputs = {
    action: string;
    issueBody: string;
    issueTemplatePath: string;
    projectId: number;
    workspace: string;
};
/** Reasons for Issue Closure */
export type IssueClosedReason = 'completed' | 'not_planned' | 'reopened';
/** Reservation Request Details */
export type ReservationRequest = {
    /** Check In Date */
    checkIn: Date;
    /** Check Out Date */
    checkOut: Date;
    /** Number of Guests */
    guests: number;
    /** Room Type */
    room: string;
    /** Room Amenities */
    amenities: {
        selected: RoomAmenity[];
        unselected: RoomAmenity[];
    };
};
/** Room Details */
export type Room = {
    number: number;
    type: RoomType;
    price: number;
    max_guests: number;
    amenities: RoomAmenity[];
};

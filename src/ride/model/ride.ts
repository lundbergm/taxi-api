export interface Ride {
    id: string;
    clientId: string;
    pickupLocation: string;
    dropoffLocation: string;
    proposedPrice: number;
    bids?: Array<Bid>;
}

export interface Bid {
    id: string;
    fleetId: string;
    bidAmount: number;
}

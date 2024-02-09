import { Maybe } from '../../common/types';
import { Bid, Ride } from '../model/ride';

export interface RideData {
    clientId: string;
    pickupLocation: string;
    dropoffLocation: string;
    proposedPrice: number;
}

export interface BidData {
    fleetId: string;
    bidAmount: number;
}

export interface RideRepository {
    getRides(): Promise<Array<Ride>>;
    getRideById(id: string): Promise<Maybe<Ride>>;
    createRide(rideData: RideData): Promise<Ride>;
    createBid(rideId: string, bidData: BidData): Promise<Bid>;
}

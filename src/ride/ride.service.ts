import { Maybe } from '../common/types';
import { NotFoundError } from '../error/http.error';
import { Bid, Ride } from './model/ride';
import { ClientRepository } from './repository/client.repository';
import { RideRepository } from './repository/ride.repository';

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

export class RideService {
    constructor(
        private rideRepository: RideRepository,
        private clientRepository: ClientRepository,
    ) {}

    getRides(): Promise<Array<Ride>> {
        return this.rideRepository.getRides();
    }

    getRideById(id: string): Promise<Maybe<Ride>> {
        return this.rideRepository.getRideById(id);
    }

    async createRide(rideData: RideData): Promise<Ride> {
        const client = await this.clientRepository.getClientById(rideData.clientId);
        if (client === undefined) {
            throw new NotFoundError('Client not found');
        }

        return this.rideRepository.createRide(rideData);
    }

    async createBid(rideId: string, bidData: BidData): Promise<Bid> {
        const ride = await this.rideRepository.getRideById(rideId);
        if (ride === undefined) {
            throw new NotFoundError('Ride not found');
        }

        return this.rideRepository.createBid(rideId, bidData);
    }
}

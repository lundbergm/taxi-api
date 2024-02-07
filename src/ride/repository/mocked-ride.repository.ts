import { Bid, Ride } from '../model/ride';
import { RideRepository } from './ride.repository';

export class MockedRideRepository implements RideRepository {
    getRides(): Promise<Array<Ride>> {
        return Promise.resolve([
            {
                id: 'ride1',
                clientId: 'client1',
                pickupLocation: '123 Main St',
                dropoffLocation: '456 Elm St',
                proposedPrice: 20,
            },
            {
                id: 'ride2',
                clientId: 'client2',
                pickupLocation: '789 Oak St',
                dropoffLocation: '101 Pine St',
                proposedPrice: 25,
            },
        ]);
    }

    getRideById(id: string): Promise<Ride> {
        return Promise.resolve({
            id,
            clientId: 'client1',
            pickupLocation: '123 Main St',
            dropoffLocation: '456 Elm St',
            proposedPrice: 20,
            bids: [
                {
                    id: 'bid1',
                    fleetId: 'fleet1',
                    bidAmount: 18,
                },
                {
                    id: 'bid2',
                    fleetId: 'fleet2',
                    bidAmount: 22,
                },
            ],
        });
    }

    createRide(): Promise<Ride> {
        return Promise.resolve({
            id: 'ride5',
            clientId: 'client5',
            pickupLocation: '101 Pine St',
            dropoffLocation: '123 Main St',
            proposedPrice: 30,
        });
    }

    createBid(): Promise<Bid> {
        return Promise.resolve({
            id: 'bid3',
            fleetId: 'fleet3',
            bidAmount: 25,
        });
    }
}

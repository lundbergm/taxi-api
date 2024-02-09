import { Collection, Db, ObjectId, WithId } from 'mongodb';
import { Bid, Ride } from '../model/ride';
import { Maybe } from '../../common/types';
import { BidData, RideData, RideRepository } from './ride.repository';
import { v4 as uuid } from 'uuid';

type RideWithoutId = Omit<Ride, 'id'>;

export class MongoDbRideRepository implements RideRepository {
    private readonly ridesCollection: Collection<RideWithoutId>;

    constructor(db: Db) {
        this.ridesCollection = db.collection<RideWithoutId>('rides');
    }

    async getRides(): Promise<Array<Ride>> {
        const rides = await this.ridesCollection.find().toArray();

        return rides.map((ride) => toRide(ride));
    }

    async getRideById(id: string): Promise<Maybe<Ride>> {
        const objectId = new ObjectId(id);
        const ride = await this.ridesCollection.findOne({ _id: objectId });

        if (ride === null) {
            return undefined;
        }
        return toRide(ride, true);
    }

    async createRide(rideData: RideData): Promise<Ride> {
        const ride: RideWithoutId = {
            clientId: rideData.clientId,
            pickupLocation: rideData.pickupLocation,
            dropoffLocation: rideData.dropoffLocation,
            proposedPrice: rideData.proposedPrice,
            bids: [],
        };

        const result = await this.ridesCollection.insertOne(ride);
        if (!result.acknowledged) {
            throw new Error('Failed to create ride');
        }

        return toRide({ _id: result.insertedId, ...ride }, true);
    }

    async createBid(rideId: string, bidData: BidData): Promise<Bid> {
        const bid: Bid = {
            id: uuid(),
            fleetId: bidData.fleetId,
            bidAmount: bidData.bidAmount,
        };

        const objectId = new ObjectId(rideId);
        const result = await this.ridesCollection.updateOne({ _id: objectId }, { $push: { bids: bid } });

        if (result.modifiedCount !== 1) {
            throw new Error('Failed to add bid');
        }

        return bid;
    }
}

function toRide(ride: WithId<RideWithoutId>, includeBids: boolean = false): Ride {
    return {
        id: ride._id.toString(),
        clientId: ride.clientId,
        pickupLocation: ride.pickupLocation,
        dropoffLocation: ride.dropoffLocation,
        proposedPrice: ride.proposedPrice,
        ...(includeBids && { bids: ride.bids }),
    };
}

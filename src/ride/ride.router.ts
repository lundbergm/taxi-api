import Router from 'koa-router';
import { BidData, RideData, RideService } from './ride.service';
import { BadUserInputError, NotFoundError } from '../error/http.error';

export function createRideRouter(rideService: RideService): Router {
    const router = new Router();

    router.get('/', async (ctx) => {
        const rides = await rideService.getRides();
        ctx.body = rides;
        ctx.status = 200;
    });

    router.post('/', async (ctx) => {
        const rideData = ctx.request.body;

        if (!isRideData(rideData)) {
            throw new BadUserInputError(
                'Invalid request body. Expected clientId, pickupLocation, dropoffLocation, and proposedPrice.',
            );
        }

        if (!isValidId(rideData.clientId)) {
            throw new BadUserInputError('Invalid client id');
        }

        const ride = await rideService.createRide(rideData);

        ctx.body = ride;
        ctx.set('Location', `/ride/${ride.id}`);
        ctx.status = 201;
    });

    router.get('/:id', async (ctx) => {
        const rideId = ctx.params.id;
        if (!isValidId(rideId)) {
            throw new BadUserInputError('Invalid ride id');
        }

        const ride = await rideService.getRideById(rideId);

        if (ride === undefined) {
            throw new NotFoundError('Ride not found');
        }

        ctx.body = ride;
        ctx.status = 200;
    });

    router.post('/:id/bid', async (ctx) => {
        const rideId = ctx.params.id;
        const bidData = ctx.request.body;

        if (!isValidId(rideId)) {
            throw new BadUserInputError('Invalid ride id');
        }

        if (!isBidData(bidData)) {
            throw new BadUserInputError('Invalid request body. Expected fleetId and bidAmount.');
        }

        const bid = await rideService.createBid(rideId, bidData);

        ctx.body = bid;
        ctx.status = 201;
    });

    return router;
}

function isRideData(data: unknown): data is RideData {
    if (typeof data !== 'object' || data === null) {
        return false;
    }
    const rideData = data as RideData;
    return (
        typeof rideData.clientId === 'string' &&
        typeof rideData.pickupLocation === 'string' &&
        rideData.pickupLocation.length > 0 &&
        typeof rideData.dropoffLocation === 'string' &&
        rideData.dropoffLocation.length > 0 &&
        typeof rideData.proposedPrice === 'number' &&
        rideData.proposedPrice > 0
    );
}

function isBidData(data: unknown): data is BidData {
    if (typeof data !== 'object' || data === null) {
        return false;
    }
    const bidData = data as BidData;
    return (
        typeof bidData.fleetId === 'string' &&
        bidData.fleetId.length > 0 &&
        typeof bidData.bidAmount === 'number' &&
        bidData.bidAmount > 0
    );
}

function isValidId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id) && id.length === 24;
}

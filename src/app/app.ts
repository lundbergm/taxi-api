import { Server } from 'http';
import { createRouter } from './router';
import HttpServer, { OnServerStarted } from './server';
import { AppConfig } from './config';
import { createRideRouter } from '../ride/ride.router';
import { RideService } from '../ride/ride.service';
import { MockedRideRepository } from '../ride/repository/mocked-ride.repository';
import { MongoClient } from 'mongodb';
import { MongoDbRideRepository } from '../ride/repository/mongodb-ride.repository';
import { MockedClientRepository } from '../ride/repository/mocked-client.repository';
import { MongoDbClientRepository } from '../ride/repository/mongodb-client.repository';

type Closable = () => Promise<void>;

export default class App {
    private closable: Array<Closable> = [];

    constructor(private config: AppConfig) {}

    async close(): Promise<void> {
        for (const close of this.closable) {
            await close();
        }
    }

    async start(onServerStarted?: OnServerStarted): Promise<Server> {
        const config = this.config;
        const httpServer = new HttpServer();

        let rideRepository;
        let clientRepository;

        if (config.mode === 'MOCK') {
            console.warn('MOCK mode');

            rideRepository = new MockedRideRepository();
            clientRepository = new MockedClientRepository();
        } else {
            const dbClient = new MongoClient(config.db.connectionString);
            this.closable.push(() => dbClient.close());

            const db = dbClient.db(config.db.name);

            rideRepository = new MongoDbRideRepository(db);
            clientRepository = new MongoDbClientRepository(db);
        }

        const rideService = new RideService(rideRepository, clientRepository);

        const rideRouter = createRideRouter(rideService);
        const router = createRouter(rideRouter);

        httpServer.koa.use(router.routes()).use(router.allowedMethods());

        return httpServer.start(config.port, onServerStarted);
    }
}

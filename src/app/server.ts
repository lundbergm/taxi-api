import Koa from 'koa';
import { Server } from 'http';
import bodyParser from 'koa-bodyparser';
import { loggingMiddleware } from '../middleware/logging.mw';
import { errorMiddleware } from '../middleware/error.mw';

export type OnServerStarted = (port: number) => void;

export default class HttpServer {
    public readonly koa: Koa;

    constructor() {
        this.koa = new Koa();
        this.koa.use(errorMiddleware);
        this.koa.use(loggingMiddleware({ colorize: process.stdout.isTTY }));
        this.koa.use(bodyParser());
    }

    async start(port: number, onServerStarted?: OnServerStarted): Promise<Server> {
        return this.koa.listen(port, () => {
            if (onServerStarted !== undefined) {
                onServerStarted(port);
            }
        });
    }
}

import Router from 'koa-router';

export function createRouter(rideRouter: Router): Router {
    const router = new Router();

    router.use('/ride', rideRouter.routes());

    return router;
}

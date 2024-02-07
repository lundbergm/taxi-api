import { Context, Next } from 'koa';
import { HttpError } from '../error/http.error';

export async function errorMiddleware(ctx: Context, next: Next): Promise<void> {
    try {
        await next();
    } catch (err) {
        let message = 'Server error';
        let status = 500;

        if (err instanceof HttpError) {
            message = err.message;
            status = err.status;
        }

        console.error(err);

        ctx.status = status;
        ctx.body = {
            code: status,
            message: message,
        };
    }
}

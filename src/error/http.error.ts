export class HttpError extends Error {
    constructor(
        title: string,
        public status: number,
    ) {
        super(title);
    }
}

export class BadUserInputError extends HttpError {
    constructor(message: string) {
        super(message, 400);
    }
}

export class NotFoundError extends HttpError {
    constructor(message: string) {
        super(message, 404);
    }
}

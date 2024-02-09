import { Middleware } from 'koa';
import koaLogger from 'koa-logger';

const regex = ansiRegex();

export function loggingMiddleware({ colorize = false } = {}): Middleware {
    return koaLogger((str) => {
        const msg = colorize ? str : str.replace(regex, '');
        console.info(msg);
    });
}

// From https://github.com/chalk/ansi-regex
function ansiRegex() {
    const pattern = [
        '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
        '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))',
    ].join('|');

    // eslint-disable-next-line security/detect-non-literal-regexp
    return new RegExp(pattern, 'g');
}

import { injectable } from 'inversify';

import { LoggingLevel } from '../constants/logging-level';

import type { EnvVariables, LoggerInterface } from '../models';

@injectable()
export class ConsoleLogger implements LoggerInterface {
    private _defaultLoggingLevel: number = LoggingLevel.INFO;
    private _loggingLevel: number;

    constructor() {
        const { LOGGING_LEVEL } = process.env as EnvVariables;
        if (LOGGING_LEVEL) {
            this._loggingLevel = LoggingLevel[LOGGING_LEVEL] || this._defaultLoggingLevel;
            return;
        }

        this._loggingLevel = this._defaultLoggingLevel;
    }

    info(...args: unknown[]): void {
        this.checkLevel(LoggingLevel.INFO) && console.info(this.processArguments(args));
    }
    warn(...args: unknown[]): void {
        this.checkLevel(LoggingLevel.WARN) && console.info(this.processArguments(args));
    }
    error(...args: unknown[]): void {
        this.checkLevel(LoggingLevel.ERROR) && console.info(this.processArguments(args));
    }
    debug(...args: unknown[]): void {
        this.checkLevel(LoggingLevel.DEBUG) && console.info(this.processArguments(args));
    }

    private stringify(message: unknown): string {
        if (typeof message === 'object') {
            return JSON.stringify(message, null, 2);
        }

        return `${message}`;
    }

    private processArguments(args: unknown[]): string {
        const message = args.map((arg) => this.stringify(arg)).join(' ');

        return message;
    }

    private checkLevel(level: number): boolean {
        return level >= this._loggingLevel;
    }
}

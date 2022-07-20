import { inject, injectable } from 'inversify';

import { IoCTypes } from '../../inversify.types';

import type { Email, EmailServiceInterface, EmailStrategyInterface } from './models';

@injectable()
export class EmailService implements EmailServiceInterface {
    constructor(
        @inject(IoCTypes.EmailStrategy)
        private _emailStrategy: EmailStrategyInterface,
    ) {}

    async send(email: Email): Promise<Email> {
        throw new Error('Method not implemented.');
    }
}

import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { inject, injectable } from 'inversify';

import { IoCTypes } from '../../../inversify.types';

import type { LoggerInterface } from '../../../shared/models';
import type { Email, EmailStrategyInterface } from '../models';

@injectable()
export class EmailStrategySes implements EmailStrategyInterface {
    private _ses = new SESClient({ region: process.env.SES_REGION });

    constructor(
        @inject(IoCTypes.Logger)
        private _logger: LoggerInterface,
    ) {}

    async send(email: Email): Promise<Email> {
        const params = this.getParameters(email);
        const response = await this._ses.send(new SendEmailCommand(params));
        this._logger.info('SES Response', response);

        return email;
    }

    private getParameters(email: Email): any {
        const params = {
            Destination: {
                ToAddresses: [email.to],
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: email.body,
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: email.subject,
                },
            },
            Source: email.from,
        };

        return params;
    }
}

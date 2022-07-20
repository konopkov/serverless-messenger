import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { injectable } from 'inversify';

import { Email, EmailStrategyInterface } from '../models';

@injectable()
export class EmailStrategySes implements EmailStrategyInterface {
    private _ses = new SESClient({ region: process.env.SES_REGION });

    async send(email: Email): Promise<Email> {
        const params = this.getParameters(email);
        const data = await this._ses.send(new SendEmailCommand(params));

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
                        Data: email.message,
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

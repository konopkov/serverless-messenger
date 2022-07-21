import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { injectable } from 'inversify';

import { SMS, SmsStrategyInterface } from '../models';

@injectable()
export class SmsStrategySns implements SmsStrategyInterface {
    private _sns = new SNSClient({ region: process.env.SES_REGION });

    async send(sms: SMS): Promise<SMS> {
        const params = {
            PhoneNumber: sms.to,
            Message: sms.body,
        };

        await this._sns.send(new PublishCommand(params));
        return sms;
    }
}

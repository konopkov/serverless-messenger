import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { inject, injectable } from 'inversify';

import { IoCTypes } from '../../../inversify.types';

import type { LoggerInterface } from '../../../shared/models';
import type { SMS, SmsStrategyInterface } from '../models';

@injectable()
export class SmsStrategySns implements SmsStrategyInterface {
    private _sns = new SNSClient({ region: process.env.SES_REGION });

    constructor(
        @inject(IoCTypes.Logger)
        private _logger: LoggerInterface,
    ) {}

    async send(sms: SMS): Promise<SMS> {
        const params = {
            PhoneNumber: sms.to,
            Message: sms.body,
        };

        const response = await this._sns.send(new PublishCommand(params));
        this._logger.info('SNS Response', response);

        return sms;
    }
}

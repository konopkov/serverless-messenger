import { inject, injectable } from 'inversify';
import { IoCTypes } from '../../inversify.types';
import { SMS, SmsServiceInterface, SmsStrategyInterface } from './models';

@injectable()
export class SmsService implements SmsServiceInterface {
    constructor(
        @inject(IoCTypes.SmsStrategy)
        private _smsStrategy: SmsStrategyInterface,
    ) {}

    async send(sms: SMS): Promise<SMS> {
        return await this._smsStrategy.send(sms);
    }
}

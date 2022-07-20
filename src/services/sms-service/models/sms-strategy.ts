import { SMS } from './sms';

export interface SmsStrategyInterface {
    send(sms: SMS): Promise<SMS>;
}

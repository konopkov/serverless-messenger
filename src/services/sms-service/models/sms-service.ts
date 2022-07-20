import { SMS } from './sms';

export interface SmsServiceInterface {
    send(sms: SMS): Promise<SMS>;
}

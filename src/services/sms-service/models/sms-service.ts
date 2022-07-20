import { Message } from '../../../shared/models';
import { SMS } from './sms';

export interface SmsServiceInterface {
    send(message: Message): Promise<SMS>;
}

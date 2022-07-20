import { Message } from '../../../shared/models';
import { Email } from './email';

export interface EmailServiceInterface {
    send(message: Message): Promise<Email>;
}

import { Message } from '../../../shared/models';
import { MessageFilter } from './';

export interface MessageServiceInterface {
    send(message: Message): Promise<Message>;
    get(filter: MessageFilter): Promise<Message[]>;
}

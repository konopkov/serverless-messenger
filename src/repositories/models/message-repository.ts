import { Message } from '../../shared/models';

export interface MessageRepositoryInterface {
    save(message: Message): Promise<Message>;
    getByRecipient(recipient: string): Promise<Message[]>;
}

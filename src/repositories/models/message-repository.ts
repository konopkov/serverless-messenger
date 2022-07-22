import type { Message, PageParams, PaginatedResponse } from '../../shared/models';

export interface MessageRepositoryInterface {
    save(message: Message): Promise<Message>;
    getByRecipient(recipient: string, pageParams: PageParams): Promise<PaginatedResponse<Message>>;
}

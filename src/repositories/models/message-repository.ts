import type { Message, MessageWithDeliveryStatus, PageParams, PaginatedResponse } from '../../shared/models';

export interface MessageRepositoryInterface {
    save(message: MessageWithDeliveryStatus): Promise<Message>;
    getByRecipient(recipient: string, pageParams: PageParams): Promise<PaginatedResponse<Message>>;
}

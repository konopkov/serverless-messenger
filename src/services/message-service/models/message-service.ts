import type { Message, PageParams, PaginatedResponse } from '../../../shared/models';
import type { MessageFilter } from './message-filter';

export interface MessageServiceInterface {
    send(message: Message): Promise<Message>;
    get(filter: MessageFilter, pageParams?: PageParams): Promise<PaginatedResponse<Message>>;
}

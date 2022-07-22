import { AppSyncResolverEvent } from 'aws-lambda';

import { Mutations } from '../graphql/mutations';
import { Queries } from '../graphql/queries';
import container from '../inversify.config';
import { IoCTypes } from '../inversify.types';
import { MessageFilter } from '../services/message-service/models';
import { Message, PaginatedResponse } from '../shared/models';

import type { MessageServiceInterface } from '../services';
const messageService = container.get<MessageServiceInterface>(IoCTypes.MessageService);

type Arguments = {
    input: Message;
    filter: MessageFilter;
    first?: number;
    after?: string;
};

export const handler = async (
    _event: AppSyncResolverEvent<Arguments>,
): Promise<Message | PaginatedResponse<Message>> => {
    switch (_event.info.fieldName) {
        case Queries.getMessages:
            const { filter, first, after } = _event.arguments;
            return messageService.get(filter, { first, after });

        case Mutations.sendMessage: {
            const message = _event?.arguments?.input;
            return messageService.send(message);
        }

        default:
            throw new Error(`Unknown request: ${_event.info.fieldName}`);
    }
};

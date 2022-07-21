import { AppSyncResolverEvent, Context } from 'aws-lambda';

import { Mutations } from '../graphql/mutations';
import { Queries } from '../graphql/queries';
import container from '../inversify.config';
import { IoCTypes } from '../inversify.types';
import { Message } from '../shared/models';

import type { MessageServiceInterface } from '../services';
import { MessageFilter } from '../services/message-service/models';

const messageService = container.get<MessageServiceInterface>(IoCTypes.MessageService);

type Arguments = {
    input: Message;
    filter: MessageFilter;
};

export const handler = async (_event: AppSyncResolverEvent<Arguments>, _context: Context): Promise<any> => {
    switch (_event.info.fieldName) {
        case Queries.getMessages:
            return messageService.get(_event?.arguments?.filter);

        case Mutations.sendMessage: {
            const message = _event?.arguments?.input;
            return messageService.send(message);
        }

        default:
            break;
    }

    return [];
};

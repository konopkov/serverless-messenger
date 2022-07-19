import { Context, AppSyncResolverEvent } from 'aws-lambda';
import { Mutations } from '../graphql/mutations';
import { Queries } from '../graphql/queries';
import { NotificationMessage } from '../shared/models';

type Arguments = {
    input: NotificationMessage;
};

export const handler = async (_event: AppSyncResolverEvent<Arguments>, _context: Context): Promise<any> => {
    switch (_event.info.fieldName) {
        case Queries.getMessages:
            return [];

        case Mutations.sendMessage: {
            const message = _event?.arguments?.input;
            return message;
        }

        default:
            break;
    }

    return [];
};

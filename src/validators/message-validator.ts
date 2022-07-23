import { injectable } from 'inversify';
import * as joi from 'joi';

import { DeliveryMethod } from '../shared/models';
import { ValidatorInterface } from './models/validator-interface';
import { EmailMessageSchema, SMSMessageSchema } from './schemas';

import type { Message } from '../shared/models';

@injectable()
export class MessageValidator implements ValidatorInterface<Message> {
    validate(message: Message): Message {
        const schemas = {
            [DeliveryMethod.SMS]: SMSMessageSchema,
            [DeliveryMethod.EMAIL]: EmailMessageSchema,
        };

        const { deliveryMethod } = message;
        const schema = schemas[deliveryMethod];

        if (!schema) {
            throw new Error(`Missing validation schema for delivery method ${deliveryMethod}`);
        }

        const validationResult = joi.object(schema).validate(message);
        const { error, value } = validationResult;

        if (error) {
            throw error;
        }

        return value;
    }
}

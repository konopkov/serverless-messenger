import * as joi from 'joi';

import { DeliveryMethod } from '../shared/models';
import { EmailMessageSchema, SMSMessageSchema } from './schemas';
import { ValidatorInterface } from './models/validator-interface';

import type { NotificationMessage } from '../shared/models';
export class MessageValidator implements ValidatorInterface<NotificationMessage> {
    validate(message: NotificationMessage): NotificationMessage {
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

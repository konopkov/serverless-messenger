import * as joi from 'joi';

import { DeliveryMethod } from '../../shared/models';
import { MessageSchema } from './message';

const EmailAddressSchema = joi.string().email();

export const EmailMessageSchema = {
    ...MessageSchema,
    to: EmailAddressSchema.required(),
    from: EmailAddressSchema,
    subject: joi.string(),
    deliveryMethod: joi.string().valid(DeliveryMethod.EMAIL),
};

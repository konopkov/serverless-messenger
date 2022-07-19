import * as joi from 'joi';
import { MessageSchema } from './message';

const EmailAddressSchema = joi.string().email();

export const EmailMessageSchema = {
    ...MessageSchema,
    to: EmailAddressSchema.required(),
    from: EmailAddressSchema,
};

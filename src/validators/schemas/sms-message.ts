import * as joi from 'joi';
import { MessageSchema } from './message';

const extendJoi = joi.extend(require('joi-phone-number'));

const DEFAULT_COUNTRY = 'NL';
const DEFAULT_FORMAT = 'e164';

const PhoneNumberSchema = extendJoi.string().phoneNumber({ defaultCountry: DEFAULT_COUNTRY, format: DEFAULT_FORMAT });

export const SMSMessageSchema = {
    ...MessageSchema,
    to: PhoneNumberSchema.required(),
    from: PhoneNumberSchema,
};

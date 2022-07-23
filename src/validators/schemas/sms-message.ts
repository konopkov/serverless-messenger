import * as joi from 'joi';
import joiPhoneNumber from 'joi-phone-number';

import { DeliveryMethod } from '../../shared/models';
import { MessageSchema } from './message';

const extendJoi = joi.extend(joiPhoneNumber);

const DEFAULT_COUNTRY = 'NL';
const DEFAULT_FORMAT = 'e164';

const PhoneNumberSchema = extendJoi.string().phoneNumber({ defaultCountry: DEFAULT_COUNTRY, format: DEFAULT_FORMAT });

export const SMSMessageSchema = {
    ...MessageSchema,
    to: PhoneNumberSchema.required(),
    from: PhoneNumberSchema,
    deliveryMethod: joi.string().valid(DeliveryMethod.SMS),
};

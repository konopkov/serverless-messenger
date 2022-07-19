import * as joi from 'joi';
import { DeliveryMethod } from '../../shared/models';

export const MessageSchema = {
    deliveryMethod: joi
        .string()
        .valid(...Object.values(DeliveryMethod))
        .required(),
    message: joi.string().required(),
};

import { faker } from '@faker-js/faker';
import { Email } from '../../services';
import { SMS } from '../../services/sms-service/models';

import { DeliveryMethod, Message } from '../models';

export function buildMessage(overrides?: Partial<Message>): Message {
    const deliveryMethod = overrides?.deliveryMethod ?? faker.helpers.arrayElement(Object.values(DeliveryMethod));

    const extras =
        deliveryMethod === DeliveryMethod.EMAIL
            ? {
                  subject: faker.lorem.sentence(),
              }
            : {};

    const data = {
        to: deliveryMethod === DeliveryMethod.EMAIL ? faker.internet.email() : faker.phone.number('+316########'),
        from: deliveryMethod === DeliveryMethod.EMAIL ? faker.internet.email() : faker.phone.number('+316########'),
        body: faker.lorem.paragraph(),
        deliveryMethod: deliveryMethod,
        ...extras,
        ...overrides,
    };

    return data;
}

export function buildEmailMessage(overrides?: Partial<Email>): Email {
    const data = buildMessage({
        ...overrides,
        deliveryMethod: DeliveryMethod.EMAIL,
    });

    return <Email>data;
}

export function buildSMSMessage(overrides?: Partial<Email>): SMS {
    const data = buildMessage({
        ...overrides,
        deliveryMethod: DeliveryMethod.SMS,
    });

    return <SMS>data;
}

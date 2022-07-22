import { faker } from '@faker-js/faker';
import { Email } from '../../services';
import { SMS } from '../../services/sms-service/models';

import { DeliveryMethod, DeliveryStatus, Message } from '../models';

export function buildMessage(overrides?: Partial<Message>): Message {
    const deliveryMethod = overrides?.deliveryMethod || faker.helpers.arrayElement(Object.values(DeliveryMethod));

    const data = {
        to: deliveryMethod === DeliveryMethod.EMAIL ? faker.internet.email() : faker.phone.number(),
        from: deliveryMethod === DeliveryMethod.EMAIL ? faker.internet.email() : faker.phone.number(),
        subject: faker.lorem.sentence(),
        body: faker.lorem.paragraph(),
        deliveryMethod: deliveryMethod,
        deliveryStatus: faker.helpers.arrayElement(Object.values(DeliveryStatus)),
        ...overrides,
    };

    return data;
}

export function buildEmailMessage(overrides?: Partial<Email>): Email {
    const data = buildMessage({
        deliveryMethod: DeliveryMethod.EMAIL,
    });

    return <Email>data;
}

export function buildSMSMessage(overrides?: Partial<Email>): SMS {
    const data = buildMessage({
        deliveryMethod: DeliveryMethod.SMS,
    });

    return <SMS>data;
}

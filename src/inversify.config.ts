import 'reflect-metadata';

import { Container } from 'inversify';

import { IoCTypes } from './inversify.types';
import {
    EmailService,
    EmailServiceInterface,
    EmailStrategySes,
    MessageService,
    SmsService,
    SmsStrategySns,
} from './services';

import type {
    SmsStrategyInterface,
    EmailStrategyInterface,
    MessageServiceInterface,
    SmsServiceInterface,
} from './services';
let container = new Container({
    defaultScope: 'Singleton',
});

container.bind<EmailServiceInterface>(IoCTypes.EmailService).to(EmailService);
container.bind<EmailStrategyInterface>(IoCTypes.EmailStrategy).to(EmailStrategySes);

container.bind<SmsServiceInterface>(IoCTypes.SmsService).to(SmsService);
container.bind<SmsStrategyInterface>(IoCTypes.SmsStrategy).to(SmsStrategySns);

container.bind<MessageServiceInterface>(IoCTypes.MessageService).to(MessageService);

export default container;

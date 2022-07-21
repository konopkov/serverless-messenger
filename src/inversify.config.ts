import 'reflect-metadata';

import { Container } from 'inversify';

import { IoCTypes } from './inversify.types';
import { EmailService, EmailStrategySes, MessageService, SmsService, SmsStrategySns } from './services';
import { ConsoleLogger } from './shared/utils';

import type { LoggerInterface } from './shared/models';
import type {
    EmailServiceInterface,
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

container.bind<LoggerInterface>(IoCTypes.Logger).to(ConsoleLogger);

export default container;

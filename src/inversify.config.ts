import 'reflect-metadata';

import { Container } from 'inversify';

import { IoCTypes } from './inversify.types';
import { MessageRepository } from './repositories';
import {
    EmailService,
    EmailStrategySes,
    MessageService,
    SmsService,
    SmsStrategySns,
    TemplateStrategyNunjucks,
} from './services';
import { ConsoleLogger } from './shared/utils';

import type { LoggerInterface } from './shared/models';
import type {
    EmailServiceInterface,
    SmsStrategyInterface,
    EmailStrategyInterface,
    MessageServiceInterface,
    SmsServiceInterface,
    TemplateStrategyInterface,
} from './services';

import type { MessageRepositoryInterface } from './repositories';

const container = new Container({
    defaultScope: 'Singleton',
});

container.bind<EmailServiceInterface>(IoCTypes.EmailService).to(EmailService);
container.bind<EmailStrategyInterface>(IoCTypes.EmailStrategy).to(EmailStrategySes);
container.bind<TemplateStrategyInterface>(IoCTypes.TemplateStrategy).to(TemplateStrategyNunjucks);

container.bind<SmsServiceInterface>(IoCTypes.SmsService).to(SmsService);
container.bind<SmsStrategyInterface>(IoCTypes.SmsStrategy).to(SmsStrategySns);

container.bind<MessageServiceInterface>(IoCTypes.MessageService).to(MessageService);

container.bind<LoggerInterface>(IoCTypes.Logger).to(ConsoleLogger);

container.bind<MessageRepositoryInterface>(IoCTypes.MessagesRepository).to(MessageRepository);

export default container;

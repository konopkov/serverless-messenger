import { inject, injectable } from 'inversify';

import { IoCTypes } from '../../inversify.types';
import { DeliveryMethod, DeliveryStatus } from '../../shared/models';

import type { SmsServiceInterface } from '../sms-service/models';
import type { LoggerInterface, Message } from '../../shared/models';
import type { EmailServiceInterface } from '../email-service/models';
import type { MessageRepositoryInterface } from '../../repositories';
import type { MessageFilter, MessageServiceInterface } from './models';
import { assert } from 'console';

@injectable()
export class MessageService implements MessageServiceInterface {
    constructor(
        @inject(IoCTypes.EmailService)
        private _emailService: EmailServiceInterface,

        @inject(IoCTypes.SmsService)
        private _smsService: SmsServiceInterface,

        @inject(IoCTypes.Logger)
        private _logger: LoggerInterface,

        @inject(IoCTypes.MessagesRepository)
        private _messageRepository: MessageRepositoryInterface,
    ) {}

    async send(message: Message): Promise<Message> {
        let deliveryService: EmailServiceInterface | SmsServiceInterface;
        let sendError: Error | null = null;

        switch (message.deliveryMethod) {
            case DeliveryMethod.SMS:
                this._logger.info(`Sending SMS message`, message);
                deliveryService = this._smsService;
                break;

            case DeliveryMethod.EMAIL:
                this._logger.info('Sending EMAIL message', message);
                deliveryService = this._emailService;
                break;

            default:
                throw new Error(`Unknown delivery method: ${message.deliveryMethod}`);
        }

        try {
            await deliveryService.send(message);
        } catch (error) {
            sendError = error as Error;
        }

        const messageWithStatus = {
            ...message,
            deliveryStatus: sendError ? DeliveryStatus.FAILED : DeliveryStatus.ACCEPTED,
        };

        return await this._messageRepository.save(messageWithStatus);
    }
    async get(filter: MessageFilter): Promise<Message[]> {
        const { to: recipient } = filter;

        return await this._messageRepository.getByRecipient(recipient);
    }
}

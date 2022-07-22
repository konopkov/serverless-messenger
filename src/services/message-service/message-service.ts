import { inject, injectable } from 'inversify';

import { IoCTypes } from '../../inversify.types';
import { DeliveryMethod, DeliveryStatus, PageParams, PaginatedResponse } from '../../shared/models';

import type { SmsServiceInterface } from '../sms-service/models';
import type { LoggerInterface, Message } from '../../shared/models';
import type { EmailServiceInterface } from '../email-service/models';
import type { MessageRepositoryInterface } from '../../repositories';
import type { MessageFilter, MessageServiceInterface } from './models';

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
        let sendResult: Message | null = null;

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
            sendResult = await deliveryService.send(message);
        } catch (error) {
            sendError = error as Error;
        }

        const messageWithStatus = {
            ...(sendResult ?? message),
            deliveryStatus: sendError ? DeliveryStatus.FAILED : DeliveryStatus.ACCEPTED,
        };

        return await this._messageRepository.save(messageWithStatus);
    }
    async get(filter: MessageFilter, pageParams: PageParams): Promise<PaginatedResponse<Message>> {
        const { to: recipient } = filter;

        return await this._messageRepository.getByRecipient(recipient, pageParams);
    }
}

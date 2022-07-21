import { inject, injectable } from 'inversify';

import { IoCTypes } from '../../inversify.types';
import { LoggerInterface, Message } from '../../shared/models';
import { DeliveryMethod } from '../../shared/models/delivery-method';
import { EmailServiceInterface } from '../email-service/models';
import { SmsServiceInterface } from '../sms-service/models';
import { MessageFilter, MessageServiceInterface } from './models';

@injectable()
export class MessageService implements MessageServiceInterface {
    constructor(
        @inject(IoCTypes.EmailService)
        private _emailService: EmailServiceInterface,

        @inject(IoCTypes.SmsService)
        private _smsService: SmsServiceInterface,

        @inject(IoCTypes.Logger)
        private _logger: LoggerInterface,
    ) {}

    async send(message: Message): Promise<Message> {
        switch (message.deliveryMethod) {
            case DeliveryMethod.SMS:
                this._logger.info(`Sending SMS message`, message);
                return await this._smsService.send(message);

            case DeliveryMethod.EMAIL:
                this._logger.info('Sending EMAIL message', message);
                return await this._emailService.send(message);

            default:
                throw new Error(`Unknown delivery method: ${message.deliveryMethod}`);
        }
    }
    async get(filter?: MessageFilter): Promise<Message[]> {
        throw new Error('Method not implemented.');
    }
}

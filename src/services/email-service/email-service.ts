import { inject, injectable } from 'inversify';

import { IoCTypes } from '../../inversify.types';

import type { LoggerInterface, Message } from '../../shared/models';
import type { Email, EmailServiceInterface, EmailStrategyInterface, TemplateStrategyInterface } from './models';

@injectable()
export class EmailService implements EmailServiceInterface {
    private _defaultSubject = 'Message';
    private _defaultFrom: string;

    constructor(
        @inject(IoCTypes.EmailStrategy)
        private _emailStrategy: EmailStrategyInterface,

        @inject(IoCTypes.Logger)
        private _logger: LoggerInterface,

        @inject(IoCTypes.TemplateStrategy)
        private _templateEngine: TemplateStrategyInterface,
    ) {
        const { DEFAULT_EMAIL_FROM } = process.env;
        if (!DEFAULT_EMAIL_FROM) {
            throw new Error('DEFAULT_EMAIL_FROM is not defined');
        }
        this._defaultFrom = DEFAULT_EMAIL_FROM;
    }

    async send(message: Message): Promise<Email> {
        const email: Email = {
            ...message,
            subject: message.subject || this._defaultSubject,
            from: message.from || this._defaultFrom,
        };
        const renderedEmail = {
            ...email,
            body: this.renderTemplate(message.body),
        };
        this._logger.debug('Sending email', renderedEmail);

        await this._emailStrategy.send(renderedEmail);
        return email;
    }

    private renderTemplate(message: string, template?: string): string {
        return this._templateEngine.render(message, template);
    }
}

/// <reference path="./templates/index.d.ts" />
import { inject, injectable } from 'inversify';
import * as nunjucks from 'nunjucks';

import { IoCTypes } from '../../inversify.types';
import defaultTemplate from './templates/default.html';

import type { LoggerInterface, Message } from '../../shared/models';
import type { Email, EmailServiceInterface, EmailStrategyInterface } from './models';

@injectable()
export class EmailService implements EmailServiceInterface {
    private _defaultTemplate = defaultTemplate;
    private _defaultSubject = 'Message';
    private _defaultFrom: string;

    constructor(
        @inject(IoCTypes.EmailStrategy)
        private _emailStrategy: EmailStrategyInterface,

        @inject(IoCTypes.Logger)
        private _logger: LoggerInterface,
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
        nunjucks.configure({ autoescape: true });
        const tmpl = template || this._defaultTemplate;

        return nunjucks.renderString(tmpl, { message });
    }
}

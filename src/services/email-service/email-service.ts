/// <reference path="./templates/index.d.ts" />
import defaultTemplate from './templates/default.html';

import { inject, injectable } from 'inversify';
import * as nunjucks from 'nunjucks';

import { IoCTypes } from '../../inversify.types';
import { Message } from '../../shared/models';

import type { Email, EmailServiceInterface, EmailStrategyInterface } from './models';

@injectable()
export class EmailService implements EmailServiceInterface {
    private _defaultTemplate = defaultTemplate;
    private _defaultSubject = 'Message';
    private _defaultFrom = 'konopkov@gmail.com';

    constructor(
        @inject(IoCTypes.EmailStrategy)
        private _emailStrategy: EmailStrategyInterface,
    ) {}

    async send(message: Message): Promise<Email> {
        const renderedEmail = {
            ...message,
            subject: message.subject || this._defaultSubject,
            from: message.from || this._defaultFrom,
            message: this.renderTemplate(message.body),
        };

        return await this._emailStrategy.send(renderedEmail);
    }

    private renderTemplate(message: string, template?: string): string {
        nunjucks.configure({ autoescape: true });
        const tmpl = template || this._defaultTemplate;

        return nunjucks.renderString(tmpl, { message });
    }
}

import { fstat } from 'fs';
import { inject, injectable } from 'inversify';
import * as nunjucks from 'nunjucks';
import * as fs from 'fs';
import * as path from 'path';

import { IoCTypes } from '../../inversify.types';

import type { Email, EmailServiceInterface, EmailStrategyInterface } from './models';
import { Message } from '../../shared/models';

@injectable()
export class EmailService implements EmailServiceInterface {
    private _templatesDir = 'templates';
    private _defaultTemplate = 'email-general.html';
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
            message: this.renderTemplate(message.message),
        };

        return await this._emailStrategy.send(renderedEmail);
    }

    private renderTemplate(message: string): string {
        nunjucks.configure({ autoescape: true });
        const template = this.getTemplateContent(this._defaultTemplate);

        return nunjucks.renderString(template, { message });
    }

    private getTemplateContent(fileName: string): string {
        return fs.readFileSync(path.resolve(this._templatesDir, fileName), 'utf8');
    }
}

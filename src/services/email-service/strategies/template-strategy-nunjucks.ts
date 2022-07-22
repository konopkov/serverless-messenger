/// <reference path="../templates/index.d.ts" />

import { injectable } from 'inversify';
import * as nunjucks from 'nunjucks';
import { TemplateStrategyInterface } from '../models/template-strategy';

import defaultTemplate from '../templates/default.html';

@injectable()
export class TemplateStrategyNunjucks implements TemplateStrategyInterface {
    private _defaultTemplate = defaultTemplate;

    render(data: Object, template?: string): string {
        nunjucks.configure({ autoescape: true });
        const tmpl = template || this._defaultTemplate;

        return nunjucks.renderString(tmpl, { data });
    }
}

import { injectable } from 'inversify';
import { Email, EmailStrategyInterface } from '../models';

@injectable()
export class EmailStrategySes implements EmailStrategyInterface {
    async send(email: Email): Promise<Email> {
        throw new Error('Method not implemented.');
    }
}

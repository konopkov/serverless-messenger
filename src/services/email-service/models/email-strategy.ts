import { Email } from './email';

export interface EmailStrategyInterface {
    send(email: Email): Promise<Email>;
}

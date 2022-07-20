import { Email } from './email';

export interface EmailServiceInterface {
    send(email: Email): Promise<Email>;
}

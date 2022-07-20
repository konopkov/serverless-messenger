import { Message } from '../../../shared/models/';

export interface Email extends Message {
    from: string;
    subject: string;
}

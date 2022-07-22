import type { DeliveryMethod, DeliveryStatus } from './';

export interface Message {
    id?: string;
    receiverId?: string;
    to: string;
    senderId?: string;
    from?: string;
    subject?: string;
    body: string;
    deliveryMethod: DeliveryMethod;
    deliveryStatus: DeliveryStatus;
    createdAt: string;
}

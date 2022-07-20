import type { DeliveryMethod, DeliveryStatus } from './';

export interface Message {
    receiverId?: string;
    to: string;
    senderId?: string;
    from?: string;
    message: string;
    deliveryMethod: DeliveryMethod;
    deliveryStatus: DeliveryStatus;
    createdAt: string;
}

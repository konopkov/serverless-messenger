import type { DeliveryMethod, DeliveryStatus } from './';

export interface Message {
    recipientId?: string;
    to: string;
    senderId?: string;
    from?: string;
    subject?: string;
    body: string;
    deliveryMethod: DeliveryMethod;
}

export interface MessageWithDeliveryStatus extends Message {
    deliveryStatus: DeliveryStatus;
}

export interface DynamoMessage extends MessageWithDeliveryStatus {
    id: string;
    createdAt: string;
}

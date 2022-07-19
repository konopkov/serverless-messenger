import { DeliveryMethod } from './delivery-method';

export interface NotificationMessage {
    to: string;
    from?: string;
    message: string;
    deliveryMethod: DeliveryMethod;
}

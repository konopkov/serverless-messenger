import { AttributeValue, DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { inject, injectable } from 'inversify';
import { ulid } from 'ulid';

import { IoCTypes } from '../inversify.types';

import type {
    DeliveryMethod,
    DeliveryStatus,
    DynamoMessage,
    LoggerInterface,
    Message,
    MessageWithDeliveryStatus,
    PageParams,
    PaginatedResponse,
} from '../shared/models';
import type { MessageRepositoryInterface } from './models';

@injectable()
export class MessageRepository implements MessageRepositoryInterface {
    private _tableName: string;
    private _client: DynamoDBClient = new DynamoDBClient({});
    private _defaultLimit = 100;

    constructor(
        @inject(IoCTypes.Logger)
        private _logger: LoggerInterface,
    ) {
        if (!process.env.TABLE_NAME) {
            throw new Error('TABLE_NAME is not set');
        }
        this._tableName = process.env.TABLE_NAME;
    }

    async save(message: MessageWithDeliveryStatus): Promise<Message> {
        const command = new PutItemCommand({
            TableName: this._tableName,
            Item: this.toItem(message),
        });

        const resp = await this._client.send(command);
        this._logger.info('DynamoDb Response', resp);

        return message;
    }

    async getByRecipient(recipient: string, pageParams: PageParams): Promise<PaginatedResponse<Message>> {
        const { first: limit = this._defaultLimit, after: next } = pageParams;
        const pk = this.constructPk(recipient);
        const command = new QueryCommand({
            TableName: this._tableName,
            KeyConditionExpression: '#pk = :pk',
            ExpressionAttributeNames: {
                '#pk': 'PK',
            },
            ExpressionAttributeValues: {
                ':pk': { S: pk },
            },
            Limit: limit,
            ExclusiveStartKey: this.constructStartKey(pk, next),
        });

        const data = await this._client.send(command);
        this._logger.info('DynamoDb Response', data);

        const messages = data.Items?.map(this.fromItem);
        const response = {
            data: messages ?? [],
            pageInfo: {
                hasNextPage: data.LastEvaluatedKey ? true : false,
                endCursor: data.LastEvaluatedKey?.SK?.S,
            },
        };

        return response;
    }

    private constructPk(recipient: string): string {
        return `MESSAGE#${recipient}`;
    }

    private constructSk(): string {
        const id = ulid();

        return `MESSAGE#${id}`;
    }

    private constructStartKey(pk: string, nextSk?: string): undefined | Record<'PK' | 'SK', AttributeValue> {
        return nextSk ? { PK: { S: pk }, SK: { S: nextSk } } : undefined;
    }

    private getTimestamp(): string {
        return Date.now().toString();
    }

    private fromItem(item: Record<string, AttributeValue>): DynamoMessage {
        return {
            id: <string>item.SK.S,
            recipientId: item.recipientId.S,
            to: <string>item.to.S,
            senderId: item.senderId.S,
            from: item.from.S,
            subject: item.subject.S,
            body: <string>item.body.S,
            deliveryMethod: <DeliveryMethod>item.deliveryMethod.S,
            deliveryStatus: <DeliveryStatus>item.deliveryStatus.S,
            createdAt: <string>item.createdAt.N,
        };
    }

    private toItem(message: MessageWithDeliveryStatus): Record<string, AttributeValue> {
        return {
            PK: { S: this.constructPk(message.to) },
            SK: { S: this.constructSk() },
            recipientId: message.recipientId ? { S: message.recipientId } : { NULL: true },
            to: { S: message.to },
            senderId: message.senderId ? { S: message.senderId } : { NULL: true },
            from: message.from ? { S: message.from } : { NULL: true },
            subject: message.subject ? { S: message.subject } : { NULL: true },
            body: { S: message.body },
            deliveryMethod: { S: message.deliveryMethod },
            deliveryStatus: { S: message.deliveryStatus },
            createdAt: { N: this.getTimestamp() },
        };
    }
}

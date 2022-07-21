import { DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { inject, injectable } from 'inversify';
import { ulid } from 'ulid';

import { IoCTypes } from '../inversify.types';
import { LoggerInterface, Message } from '../shared/models';
import { MessageRepositoryInterface } from './models/message-repository';

@injectable()
export class MessageRepository implements MessageRepositoryInterface {
    private _tableName: string;
    private _client: DynamoDBClient = new DynamoDBClient({});

    constructor(
        @inject(IoCTypes.Logger)
        private _logger: LoggerInterface,
    ) {
        if (!process.env.TABLE_NAME) {
            throw new Error('TABLE_NAME is not set');
        }
        this._tableName = process.env.TABLE_NAME;
    }

    async save(message: Message): Promise<Message> {
        const command = new PutItemCommand({
            TableName: this._tableName,
            Item: {
                PK: { S: this.constructPk(message.to) },
                SK: { S: this.constructSk() },
                receiverId: message.receiverId ? { S: message.receiverId } : { NULL: true },
                to: { S: message.to },
                senderId: message.senderId ? { S: message.senderId } : { NULL: true },
                from: message.from ? { S: message.from } : { NULL: true },
                subject: message.subject ? { S: message.subject } : { NULL: true },
                body: { S: message.body },
                deliveryMethod: { S: message.deliveryMethod },
                deliveryStatus: { S: message.deliveryStatus },
                createdAt: { N: this.getTimestamp() },
            },
        });

        const resp = await this._client.send(command);
        this._logger.info('DynamoDb Response', resp);

        return message;
    }

    async getByRecipient(recipient: string): Promise<Message[]> {
        const command = new QueryCommand({
            TableName: this._tableName,
            KeyConditionExpression: '#pk = :pk',
            ExpressionAttributeNames: {
                '#pk': 'PK',
            },
            ExpressionAttributeValues: {
                ':pk': { S: this.constructPk(recipient) },
            },
        });

        const data = await this._client.send(command);
        this._logger.info('DynamoDb Response', data);

        const messages =
            data.Items?.map((item) => {
                return {
                    receiverId: item.receiverId ? item.receiverId.S : undefined,
                    to: item.to.S,
                    senderId: item.senderId ? item.senderId.S : undefined,
                    from: item.from ? item.from.S : undefined,
                    subject: item.subject ? item.subject.S : undefined,
                    body: item.body.S,
                    deliveryMethod: item.deliveryMethod.S,
                    deliveryStatus: item.deliveryStatus.S,
                    createdAt: item.createdAt.N,
                };
            }) || [];

        return messages as Message[];
    }

    private constructPk(recipient: string): string {
        return `MESSAGE#${recipient}`;
    }

    private constructSk(): string {
        const id = ulid();

        return `MESSAGE#${id}`;
    }

    private getTimestamp(): string {
        return Date.now().toString();
    }
}

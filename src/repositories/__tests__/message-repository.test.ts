import { PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';

import { buildMessage } from '../../shared/__tests__/builders';
import { getDynamoMock, getMockLogger } from '../../shared/__tests__/mocks';
import { MessageRepository } from '../message-repository';

const mockLogger = getMockLogger();
const ddbMock = getDynamoMock();

describe('MessageRepository', () => {
    beforeEach(() => {
        process.env.TABLE_NAME = 'FAKE_TABLE_NAME';

        jest.resetAllMocks();
    });

    it('Throws an error if process.env.TABLE_NAME is not set', async () => {
        process.env.TABLE_NAME = '';

        expect(() => new MessageRepository(mockLogger)).toThrowErrorMatchingInlineSnapshot(`"TABLE_NAME is not set"`);
    });

    it('Trigger PutItemCommand on send()', async () => {
        const repository = new MessageRepository(mockLogger);
        const fakeMessage = buildMessage();
        const spy = jest.spyOn(ddbMock, 'send');

        await repository.save(fakeMessage);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(expect.any(PutItemCommand));
    });

    it('Trigger QueryCommand on getByRecipient()', async () => {
        const repository = new MessageRepository(mockLogger);
        const fakeMessage = buildMessage();

        (ddbMock.send as jest.Mock).mockResolvedValue({});
        const spy = jest.spyOn(ddbMock, 'send');

        await repository.getByRecipient(fakeMessage.to, {});

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(expect.any(QueryCommand));
    });
});

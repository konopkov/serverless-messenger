import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { SESClient } from '@aws-sdk/client-ses';
import { SNSClient } from '@aws-sdk/client-sns';

import type { LoggerInterface } from '../models';
import type {
    EmailServiceInterface,
    EmailStrategyInterface,
    SmsServiceInterface,
    SmsStrategyInterface,
    TemplateStrategyInterface,
} from '../../services';
import type { MessageRepositoryInterface } from '../../repositories';

export function getDynamoMock() {
    const ddbMock = {
        send: jest.fn(),
    };
    jest.mock('@aws-sdk/client-dynamodb', () => ({
        ddbMock,
    }));
    return new DynamoDBClient({});
}

export function getSESMock() {
    const sesMock = {
        send: jest.fn(),
    };
    jest.mock('@aws-sdk/client-ses', () => ({
        sesMock,
    }));
    return new SESClient({});
}

export function getSNSMock() {
    const sesMock = {
        send: jest.fn(),
    };
    jest.mock('@aws-sdk/client-sns', () => ({
        sesMock,
    }));
    return new SNSClient({});
}

export function getMockLogger(): LoggerInterface {
    const mockLogger = {
        info: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
        warn: jest.fn(),
    };

    return mockLogger;
}

export function getMockEmailService(): EmailServiceInterface {
    const mockEmailService = {
        send: jest.fn(),
    };

    return mockEmailService;
}

export function getMockSMSService(): SmsServiceInterface {
    const mockEmailService = {
        send: jest.fn(),
    };

    return mockEmailService;
}

export function getMockMessageRepository(): MessageRepositoryInterface {
    const mockMessageRepository = {
        save: jest.fn(),
        getByRecipient: jest.fn(),
    };

    return mockMessageRepository;
}

export function getMockEmailStrategy(): EmailStrategyInterface {
    const mockEmailStrategy = {
        send: jest.fn(),
    };

    return mockEmailStrategy;
}

export function getMockSmsStrategy(): SmsStrategyInterface {
    const mockEmailStrategy = {
        send: jest.fn(),
    };

    return mockEmailStrategy;
}

export function getMockTemplateEngine(): TemplateStrategyInterface {
    const mockTemplateEngine = {
        render: jest.fn(),
    };

    return mockTemplateEngine;
}

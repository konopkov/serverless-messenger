import { buildEmailMessage, buildSMSMessage } from '../../shared/__tests__/builders';
import { Message } from '../../shared/models';
import { MessageValidator } from '../message-validator';

describe('Message validator', () => {
    getTestCases().forEach(({ testName, message, expectedResult, expectedErrorMessage }) => {
        test(`Validate message to ${message.to}: ${testName}`, () => {
            const validator = new MessageValidator();

            try {
                const result = validator.validate(<Message>message);
                expect(result).toMatchObject(expectedResult);
            } catch (err) {
                expect((err as Error).message).toBe(expectedErrorMessage);
            }
        });
    });
});

function getTestCases() {
    const validEmailMessage = buildEmailMessage();
    const validSmsMessage = buildSMSMessage();

    const cases = [
        {
            testName: 'Invalid phone number',
            message: {
                ...validSmsMessage,
                to: '+31abcd1234',
            },
            expectedResult: {},
            expectedErrorMessage: '""to"" did not seem to be a phone number',
        },
        {
            testName: 'Valid phone number',
            message: {
                ...validSmsMessage,
            },
            expectedResult: {
                ...validSmsMessage,
            },
            expectedErrorMessage: null,
        },
        {
            testName: 'Valid phone number with formatting',
            message: {
                ...validSmsMessage,
                to: '+31 (12) 34 56 78',
                from: '+31 (98) 76 54 32',
            },
            expectedResult: {
                ...validSmsMessage,
                to: '+3112345678',
                from: '+3198765432',
            },
            expectedErrorMessage: null,
        },
        {
            testName: 'Invalid email address',
            message: {
                ...validEmailMessage,
                to: 'ab-cd',
            },
            expectedResult: {},
            expectedErrorMessage: '"to" must be a valid email',
        },
        {
            testName: 'Invalid email address',
            message: {
                ...validEmailMessage,
                to: 'ab@cd',
            },
            expectedResult: {},
            expectedErrorMessage: '"to" must be a valid email',
        },
        {
            testName: 'Valid email address',
            message: {
                ...validEmailMessage,
            },
            expectedResult: {},
            expectedErrorMessage: null,
        },
        {
            testName: 'Missing validation schema',
            message: {
                to: 'Unknown',
                deliveryMethod: 'UNKNOWN_DELIVERY_METHOD',
                message: '',
            },
            expectedResult: {},
            expectedErrorMessage: 'Missing validation schema for delivery method UNKNOWN_DELIVERY_METHOD',
        },
    ];

    return cases;
}

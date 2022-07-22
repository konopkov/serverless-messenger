import { PublishCommand } from '@aws-sdk/client-sns';
import { buildEmailMessage } from '../../../../shared/__tests__/builders';
import { getMockLogger, getSNSMock } from '../../../../shared/__tests__/mocks';
import { SmsStrategySns } from '../sms-strategy-sns';

const mockLogger = getMockLogger();
const snsMock = getSNSMock();

describe('EmailStrategySES', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('Trigger SendEmailCommand on send()', async () => {
        const sesStrategy = new SmsStrategySns(mockLogger);
        const fakeMessage = buildEmailMessage();
        const spy = jest.spyOn(snsMock, 'send');

        await sesStrategy.send(fakeMessage);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(expect.any(PublishCommand));
    });
});

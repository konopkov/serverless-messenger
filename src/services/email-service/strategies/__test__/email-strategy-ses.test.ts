import { SendEmailCommand } from '@aws-sdk/client-ses';
import { buildEmailMessage } from '../../../../shared/__tests__/builders';
import { getMockLogger, getSESMock } from '../../../../shared/__tests__/mocks';
import { EmailStrategySes } from '../email-strategy-ses';

const mockLogger = getMockLogger();
const sesMock = getSESMock();

describe('EmailStrategySES', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('Trigger SendEmailCommand on send()', async () => {
        const sesStrategy = new EmailStrategySes(mockLogger);
        const fakeMessage = buildEmailMessage();
        const spy = jest.spyOn(sesMock, 'send');

        await sesStrategy.send(fakeMessage);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(expect.any(SendEmailCommand));
    });
});

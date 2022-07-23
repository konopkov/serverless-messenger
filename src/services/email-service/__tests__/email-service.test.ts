import { faker } from '@faker-js/faker';

import { buildMessage } from '../../../shared/__tests__/builders';
import { getMockEmailStrategy, getMockLogger, getMockTemplateEngine } from '../../../shared/__tests__/mocks';
import { DeliveryMethod } from '../../../shared/models';
import { EmailService } from '../email-service';

const mockEmailStrategy = getMockEmailStrategy();
const mockLogger = getMockLogger();
const mockTemplateEngine = getMockTemplateEngine();

describe('Email service', () => {
    beforeEach(() => {
        process.env.DEFAULT_EMAIL_FROM = faker.internet.email();

        jest.resetAllMocks();
        (mockTemplateEngine.render as jest.Mock).mockImplementation(({ body }) => body);
    });

    it('Throws an error if process.env.DEFAULT_EMAIL_FROM is not defined', async () => {
        process.env.DEFAULT_EMAIL_FROM = '';

        expect(
            () => new EmailService(mockEmailStrategy, mockLogger, mockTemplateEngine),
        ).toThrowErrorMatchingInlineSnapshot(`"DEFAULT_EMAIL_FROM is not defined"`);
    });

    it('Sends an email using email strategy', async () => {
        const fakeMessage = buildMessage({
            deliveryMethod: DeliveryMethod.EMAIL,
        });
        const emailService = new EmailService(mockEmailStrategy, mockLogger, mockTemplateEngine);

        const emailSpy = jest.spyOn(mockEmailStrategy, 'send');
        await emailService.send(fakeMessage);

        expect(emailSpy).toHaveBeenCalledTimes(1);
        expect(emailSpy).toHaveBeenCalledWith(fakeMessage);
    });

    it('Renders message with template engine using default template', async () => {
        const fakeMessage = buildMessage({
            deliveryMethod: DeliveryMethod.EMAIL,
        });
        const emailService = new EmailService(mockEmailStrategy, mockLogger, mockTemplateEngine);

        const renderSpy = jest.spyOn(mockTemplateEngine, 'render');
        await emailService.send(fakeMessage);

        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect(renderSpy).toHaveBeenCalledWith({ body: fakeMessage.body }, undefined);
    });

    it('Adds default subject to message', async () => {
        const fakeMessage = buildMessage({
            subject: undefined,
            deliveryMethod: DeliveryMethod.EMAIL,
        });
        const emailService = new EmailService(mockEmailStrategy, mockLogger, mockTemplateEngine);

        const emailSpy = jest.spyOn(mockEmailStrategy, 'send');
        await emailService.send(fakeMessage);

        expect(emailSpy).toHaveBeenCalledTimes(1);
        expect(emailSpy).toHaveBeenCalledWith({ ...fakeMessage, subject: 'Message' });
    });
});

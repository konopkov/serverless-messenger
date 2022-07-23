import { buildEmailMessage, buildMessage, buildSMSMessage } from '../../../shared/__tests__/builders';
import {
    getMockEmailService,
    getMockLogger,
    getMockMessageRepository,
    getMockMessageValidator,
    getMockSMSService,
} from '../../../shared/__tests__/mocks';
import { DeliveryMethod, DeliveryStatus } from '../../../shared/models';
import { MessageService } from '../message-service';

const mockEmailService = getMockEmailService();
const mockSMSService = getMockSMSService();
const mockLogger = getMockLogger();
const mockMessageRepository = getMockMessageRepository();
const mockValidator = getMockMessageValidator();

const getMessageServiceInstance = (): MessageService => {
    return new MessageService(mockEmailService, mockSMSService, mockLogger, mockMessageRepository, mockValidator);
};

describe('Message service', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        (mockValidator.validate as jest.Mock).mockImplementation((data) => {
            return data;
        });
    });

    it('Routes SMS messages to the SMS service', async () => {
        const fakeMessage = buildSMSMessage();
        const messageService = getMessageServiceInstance();

        const smsSpy = jest.spyOn(mockSMSService, 'send');
        const emailSpy = jest.spyOn(mockEmailService, 'send');
        await messageService.send(fakeMessage);

        expect(smsSpy).toHaveBeenCalledTimes(1);
        expect(smsSpy).toHaveBeenCalledWith(fakeMessage);

        expect(emailSpy).toHaveBeenCalledTimes(0);
    });

    it('Routes Email messages to the Email service', async () => {
        const fakeMessage = buildEmailMessage();
        const messageService = getMessageServiceInstance();

        const smsSpy = jest.spyOn(mockSMSService, 'send');
        const emailSpy = jest.spyOn(mockEmailService, 'send');
        await messageService.send(fakeMessage);

        expect(emailSpy).toHaveBeenCalledTimes(1);
        expect(emailSpy).toHaveBeenCalledWith(fakeMessage);

        expect(smsSpy).toHaveBeenCalledTimes(0);
    });

    it('Throws an error if the message has no delivery method', async () => {
        const fakeMessage = buildMessage({
            deliveryMethod: 'UNKNOWN_DELIVERY_METHOD' as DeliveryMethod,
        });
        const messageService = getMessageServiceInstance();

        await expect(messageService.send(fakeMessage)).rejects.toThrowErrorMatchingInlineSnapshot(
            `"Unknown delivery method: UNKNOWN_DELIVERY_METHOD"`,
        );
    });

    it('On success saves the message with status ACCEPTED', async () => {
        const fakeMessage = buildMessage();
        const messageService = getMessageServiceInstance();

        (mockEmailService.send as jest.Mock).mockResolvedValue(fakeMessage);
        (mockSMSService.send as jest.Mock).mockResolvedValue(fakeMessage);

        const saveSpy = jest.spyOn(mockMessageRepository, 'save');
        await messageService.send(fakeMessage);

        expect(saveSpy).toHaveBeenCalledTimes(1);
        expect(saveSpy).toHaveBeenCalledWith({ ...fakeMessage, deliveryStatus: DeliveryStatus.ACCEPTED });
    });

    it('On send error saves the message with status FAILED', async () => {
        const fakeMessage = buildMessage();
        const messageService = getMessageServiceInstance();

        (mockEmailService.send as jest.Mock).mockRejectedValue(new Error('Fake error'));
        (mockSMSService.send as jest.Mock).mockRejectedValue(new Error('Fake error'));

        const saveSpy = jest.spyOn(mockMessageRepository, 'save');
        await messageService.send(fakeMessage);

        expect(saveSpy).toHaveBeenCalledTimes(1);
        expect(saveSpy).toHaveBeenCalledWith({ ...fakeMessage, deliveryStatus: DeliveryStatus.FAILED });
    });

    it('Executes validator on send', async () => {
        const fakeMessage = buildMessage();
        const messageService = getMessageServiceInstance();

        (mockEmailService.send as jest.Mock).mockResolvedValue(fakeMessage);
        (mockSMSService.send as jest.Mock).mockResolvedValue(fakeMessage);

        await messageService.send(fakeMessage);

        expect(mockValidator.validate).toHaveBeenCalledTimes(1);
        expect(mockValidator.validate).toHaveBeenCalledWith(fakeMessage);
    });
});

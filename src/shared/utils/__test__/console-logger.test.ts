import { ConsoleLogger } from '../console-logger';

describe('Console Logger', () => {
    beforeEach(() => {
        process.env.LOGGING_LEVEL = 'INFO';

        jest.resetAllMocks();
    });

    test('Log a string', () => {
        const info = jest.spyOn(console, 'info').mockImplementation();
        const logger = new ConsoleLogger();
        const input = 'Hello World';

        logger.info(input);

        expect(info).toBeCalledWith(input);
    });

    test('Log an object', () => {
        const info = jest.spyOn(console, 'info').mockImplementation();
        const logger = new ConsoleLogger();
        const input = {
            foo: 'bar',
        };
        const expected = JSON.stringify(input, null, 2);

        logger.info(input);

        expect(info).toBeCalledWith(expected);
    });

    test('Log a string and an object', () => {
        const info = jest.spyOn(console, 'info').mockImplementation();
        const logger = new ConsoleLogger();
        const inputString = 'Hello World';
        const inputObject = {
            foo: 'bar',
        };
        const expected = `${inputString} ${JSON.stringify(inputObject, null, 2)}`;

        logger.info(inputString, inputObject);

        expect(info).toBeCalledWith(expected);
    });

    test('Log all levels when logging level DEBUG', () => {
        process.env.LOGGING_LEVEL = 'DEBUG';

        const info = jest.spyOn(console, 'info').mockImplementation();
        const warn = jest.spyOn(console, 'warn').mockImplementation();
        const error = jest.spyOn(console, 'error').mockImplementation();
        const debug = jest.spyOn(console, 'debug').mockImplementation();
        const logger = new ConsoleLogger();

        logger.info('Hello World');
        logger.warn('Hello World');
        logger.error('Hello World');
        logger.debug('Hello World');

        expect(info).toBeCalledTimes(1);
        expect(warn).toBeCalledTimes(1);
        expect(error).toBeCalledTimes(1);
        expect(debug).toBeCalledTimes(1);
    });

    test('Log only ERROR when logging level ERROR', () => {
        process.env.LOGGING_LEVEL = 'ERROR';

        const info = jest.spyOn(console, 'info').mockImplementation();
        const warn = jest.spyOn(console, 'warn').mockImplementation();
        const error = jest.spyOn(console, 'error').mockImplementation();
        const debug = jest.spyOn(console, 'debug').mockImplementation();
        const logger = new ConsoleLogger();

        logger.info('Hello World');
        logger.warn('Hello World');
        logger.error('Hello World');
        logger.debug('Hello World');

        expect(info).toBeCalledTimes(0);
        expect(warn).toBeCalledTimes(0);
        expect(error).toBeCalledTimes(1);
        expect(debug).toBeCalledTimes(0);
    });
});

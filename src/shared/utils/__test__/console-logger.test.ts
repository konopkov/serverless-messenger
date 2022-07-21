import { ConsoleLogger } from '../console-logger';

describe('Console Logger', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('Log a string', () => {
        const info = jest.spyOn(console, 'info').mockImplementation(() => {});
        const logger = new ConsoleLogger();
        const input = 'Hello World';

        logger.info(input);

        expect(info).toBeCalledWith(input);
    });

    test('Log an object', () => {
        const info = jest.spyOn(console, 'info').mockImplementation(() => {});
        const logger = new ConsoleLogger();
        const input = {
            foo: 'bar',
        };
        const expected = JSON.stringify(input, null, 2);

        logger.info(input);

        expect(info).toBeCalledWith(expected);
    });

    test('Log a string and an object', () => {
        const info = jest.spyOn(console, 'info').mockImplementation(() => {});
        const logger = new ConsoleLogger();
        const inputString = 'Hello World';
        const inputObject = {
            foo: 'bar',
        };
        const expected = `${inputString} ${JSON.stringify(inputObject, null, 2)}`;

        logger.info(inputString, inputObject);

        expect(info).toBeCalledWith(expected);
    });
});

module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>'],
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        '\\.html$': 'jest-raw-loader',
    },
    setupFiles: ['./src/inversify.config.ts'],
};

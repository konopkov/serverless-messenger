module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>'],
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        '\\.html$': 'jest-raw-loader',
    },
    setupFiles: ['./src/shared/__tests__/setupTests.ts', './src/inversify.config.ts'],
    globals: {
        'ts-jest': {
            isolatedModules: true,
        },
    },
};

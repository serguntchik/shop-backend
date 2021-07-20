module.exports = {
    moduleNameMapper: {
        "@functions/(.*)": ["<rootDir>/src/functions/$1"],
        "@libs/(.*)": ["<rootDir>/src/libs/$1"]
    },
    preset: 'ts-jest',
    testEnvironment: 'node',
};

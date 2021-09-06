class SNSMock {
    publish(_params) {}
}

const awsMock = {
    SNS: SNSMock,
}

jest.mock('aws-sdk', () => awsMock);

export const AWS_MOCK = awsMock;

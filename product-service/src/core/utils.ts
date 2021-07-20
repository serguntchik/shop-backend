import { Context } from "aws-lambda/handler";

export const MOCK_CONTEXT: Context = {
    callbackWaitsForEmptyEventLoop: false,
    functionName: 'main',
    functionVersion: '1.0.0',
    invokedFunctionArn: '',
    memoryLimitInMB: '',
    awsRequestId: '',
    logGroupName: '',
    logStreamName: '',
    getRemainingTimeInMillis: () => 0,
    done: jest.fn,
    fail: jest.fn,
    succeed: jest.fn,

}

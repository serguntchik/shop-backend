import AWS from 'aws-sdk';
import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';

import { main } from '@functions/import-products-file/handler';

import { MOCK_CONTEXT } from '../../core/testing';

const testCsvFile = 'test.csv';

beforeAll(() => {
    process.env = { ...process.env, S3_BUCKET: 'product-service-dev-csv' };
});

afterEach(() => {
    jest.resetAllMocks();
});

it('should request an s3 signed url', async () => {
    const event: Partial<APIGatewayProxyEvent> = {
        queryStringParameters: { name: testCsvFile },
    };
    const expectedSignedUrlCallParams = {
        Bucket: process.env.S3_BUCKET,
        Key: `uploaded/${testCsvFile}`,
        Expires: 60,
        ContentType: 'text/csv',
    };

    const signedUrlSpy = jest.spyOn(AWS.S3.prototype, 'getSignedUrlPromise').mockResolvedValue(null);
    await main(event, MOCK_CONTEXT, null);

    const [operation, params] = signedUrlSpy.mock.calls[0];

    expect(signedUrlSpy).toHaveBeenCalled();
    expect(operation).toBe('putObject');
    expect(params).toStrictEqual(expectedSignedUrlCallParams);
});

it('should return an s3 signed url', async () => {
    const signedUrl = 'signed url';
    const event: Partial<APIGatewayProxyEvent> = {
        queryStringParameters: { name: testCsvFile },
    };

    jest.spyOn(AWS.S3.prototype, 'getSignedUrlPromise').mockResolvedValue(signedUrl);
    const response: { body: string, statusCode: number } = await main(event, MOCK_CONTEXT, null);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).signedUrl).toBe(signedUrl);
});

it('should return 500 response in case of an error', async () => {
    const event: Partial<APIGatewayProxyEvent> = {
        queryStringParameters: { name: testCsvFile },
    };
    const error = 'Internal Error';

    jest.spyOn(AWS.S3.prototype, 'getSignedUrlPromise').mockRejectedValue(error);
    const response: { body: string, statusCode: number } = await main(event, MOCK_CONTEXT, null);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).error).toBe(error);
});

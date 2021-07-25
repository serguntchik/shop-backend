import 'source-map-support/register';

import { formatErrorJSONResponse, formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import type { APIGatewayProxyResult, Handler } from 'aws-lambda';
import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import AWS from 'aws-sdk';

const importProductsFile: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
    const bucket = 'product-service-dev-csv';
    const s3 = new AWS.S3({ region: 'eu-west-1' });
    const params = {
        Bucket: bucket,
        Key: `uploaded/${event.queryStringParameters.name}`,
        Expires: 60,
        ContentType: 'text/csv',
    };

    try {
        return formatJSONResponse({ signedUrl: await s3.getSignedUrlPromise('putObject', params) }, 200);
    } catch (error) {
        return formatErrorJSONResponse(500, error);
    }
}

export const main = middyfy(importProductsFile);

import middy from '@middy/core';
import cors from '@middy/http-cors';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { AwsLambdaVpcConfig } from '@serverless/typescript';

import { Context } from 'aws-lambda/handler';

import config from './vpc.config.json';

export const middyfy: (handler: any) => middy.Middy<any, any, Context> = (handler) => {
    return middy(handler).use(middyJsonBodyParser()).use(cors());
}

export const vpcConfig: AwsLambdaVpcConfig = {
    subnetIds: config.subnetIds,
    securityGroupIds: config.securityGroupIds,
}

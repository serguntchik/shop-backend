import middy from '@middy/core';
import cors from '@middy/http-cors';
import middyJsonBodyParser from '@middy/http-json-body-parser';

import { Context } from 'aws-lambda/handler';

export const middyfy: (handler: any) => middy.Middy<any, any, Context> = (handler) => {
    return middy(handler).use(middyJsonBodyParser()).use(cors());
}

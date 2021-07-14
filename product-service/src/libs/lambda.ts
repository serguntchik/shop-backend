import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";

import { Context } from "aws-lambda/handler";

export const middyfy: (handler: any) => middy.Middy<any, any, Context> = (handler) => {
    return middy(handler).use(middyJsonBodyParser())
}

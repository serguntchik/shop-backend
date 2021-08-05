import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse: (response: object, statusCode: number) => APIGatewayProxyResult = (response: object, statusCode) => {
    return {
        statusCode,
        body: JSON.stringify(response),
    }
}

export const formatErrorJSONResponse: (error: string, statusCode: number) => APIGatewayProxyResult = (error: string, statusCode: number) => {
    return {
        statusCode,
        body: JSON.stringify({ error }),
    }
}

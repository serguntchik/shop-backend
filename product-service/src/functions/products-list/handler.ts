import 'source-map-support/register';

import { APIGatewayProxyResult, Handler } from "aws-lambda";
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { PRODUCTS_LIST } from "../../core/products";

export const products: Handler<void, APIGatewayProxyResult> = async () => {
    return formatJSONResponse({ products: await PRODUCTS_LIST });
}

export const main = middyfy(products);

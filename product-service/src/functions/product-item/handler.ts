import 'source-map-support/register';

import { APIGatewayProxyResult, Handler } from "aws-lambda";
import { formatErrorJSONResponse, formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { PRODUCTS_LIST } from "../../core/products";

export interface ProductItemEvent {
    pathParameters: { productId: string };
}

export const getProductById: Handler<ProductItemEvent, APIGatewayProxyResult> = async (event) => {
    const productId = event.pathParameters.productId;
    const products = await PRODUCTS_LIST;
    const matchingProduct = products.find((product) => product.id === productId);

    return matchingProduct ? formatJSONResponse({ product: matchingProduct }) : formatErrorJSONResponse(404, 'Product not found');
}

export const main = middyfy(getProductById);

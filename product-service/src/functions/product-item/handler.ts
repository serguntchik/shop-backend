import 'source-map-support/register';

import { formatErrorJSONResponse, formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';

import { createProductResponse } from '../../core/utils';
import prisma from '../../prisma/client';

export const getProductById: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
    const productId = event.pathParameters!.productId;

    console.log('Get existing product by its id request', event);

    try {
        const product = await prisma.product.findUnique({
            where: {
                id: productId,
            },
            include: {
                stocks: {
                    select: {
                        count: true,
                    }
                }
            },
        });

        return product
            ? formatJSONResponse({ product: createProductResponse(product, product.stocks!.count!) }, 200)
            : formatErrorJSONResponse('Product not found', 404);
    } catch (error) {
        return formatErrorJSONResponse(error, 500);
    } finally {
        prisma.$disconnect();
    }
}

export const main = middyfy(getProductById);

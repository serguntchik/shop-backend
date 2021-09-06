import 'source-map-support/register';

import { formatErrorJSONResponse, formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { APIGatewayProxyResult, Handler } from 'aws-lambda';

import { createProductResponse } from '../../core/utils';
import prisma from '../../prisma/client';

export const products: Handler<void, APIGatewayProxyResult> = async (event) => {
    console.log('List products request', event);

    try {
        const products = await prisma.product.findMany({
            include: {
                stocks: {
                    select: {
                        count: true,
                    }
                }
            },
        });

        return formatJSONResponse({ products: products.map((product) => createProductResponse(product, product.stocks!.count)) }, 200);
    } catch (error) {
        return formatErrorJSONResponse(error, 500);
    } finally {
        prisma.$disconnect();
    }
}

export const main = middyfy(products);

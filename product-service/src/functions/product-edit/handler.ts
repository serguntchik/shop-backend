import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatErrorJSONResponse, formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { createProductResponse } from '../../core/utils';
import prisma from '../../prisma/client';

const editProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const productId = event.pathParameters!.productId;
    const { title, description, price, count } = event.body;

    console.log('Edit product request', event);

    try {
        const product = await prisma.product.update({
            where: {
                id: productId,
            },
            data: {
                title,
                description,
                price,
                stocks: {
                    update: {
                        count,
                    }
                },
            },
            include: {
                stocks: {
                    select: {
                        count: true,
                    }
                }
            },
        });

        return formatJSONResponse({ product: createProductResponse(product, product.stocks!.count) }, 200);
    } catch (error) {
        return formatErrorJSONResponse(error, 500);
    } finally {
        prisma.$disconnect();
    }
}

export const main = middyfy(editProduct);

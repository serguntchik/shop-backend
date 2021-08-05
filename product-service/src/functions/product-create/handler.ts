import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatErrorJSONResponse, formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { createProductResponse } from '../../core/utils';
import prisma from '../../prisma/client';

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const { title, description, price, count } = event.body;

    console.log('Create new product request', event);

    try {
        const product = await prisma.product.create({
            data: {
                title,
                description,
                price,
                stocks: {
                    create: {
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

        return formatJSONResponse(createProductResponse(product, product.stocks!.count!), 201);
    } catch (error) {
        return formatErrorJSONResponse(error, 500);
    } finally {
        prisma.$disconnect();
    }
}

export const main = middyfy(createProduct);

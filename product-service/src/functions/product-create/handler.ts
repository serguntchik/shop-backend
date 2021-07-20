import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatErrorJSONResponse, formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { PrismaClient } from '@prisma/client';

import schema from './schema';

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const prisma = new PrismaClient();
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
        });

        return formatJSONResponse(product, 201);
    } catch (error) {
        return formatErrorJSONResponse(500, error);
    } finally {
        prisma.$disconnect();
    }
}

export const main = middyfy(createProduct);

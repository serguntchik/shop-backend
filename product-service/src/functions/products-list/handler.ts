import 'source-map-support/register';

import { formatErrorJSONResponse, formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { PrismaClient } from '@prisma/client';

import { APIGatewayProxyResult, Handler } from "aws-lambda";

export const products: Handler<void, APIGatewayProxyResult> = async (event) => {
    const prisma = new PrismaClient();

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

        return formatJSONResponse({ products });
    } catch (error) {
        return formatErrorJSONResponse(500, error);
    } finally {
        prisma.$disconnect();
    }
}

export const main = middyfy(products);

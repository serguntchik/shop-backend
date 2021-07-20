import 'source-map-support/register';

import { formatErrorJSONResponse, formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { PrismaClient } from '@prisma/client';

import { APIGatewayProxyResult, Handler } from "aws-lambda";

export interface ProductItemEvent {
    pathParameters: { productId: string };
}

export const getProductById: Handler<ProductItemEvent, APIGatewayProxyResult> = async (event) => {
    const prisma = new PrismaClient();
    const productId = event.pathParameters.productId;

    console.log('Get existing product by its id request', event);

    try {
        const product = await prisma.product.findUnique({
            where: {
                id: productId,
            },
        });

        return product ? formatJSONResponse({ product }) : formatErrorJSONResponse(404, 'Product not found');
    } finally {
        prisma.$disconnect();
    }
}

export const main = middyfy(getProductById);

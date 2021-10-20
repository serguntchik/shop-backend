import 'source-map-support/register';

import { formatErrorJSONResponse, formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';

import prisma from '../../prisma/client';

const deleteProduct: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
    const productId = event.pathParameters!.productId;

    console.log('Delete product request', event);

    try {
        const deleteProduct = prisma.product.delete({
            where: {
                id: productId,
            },
        });
        const deleteStock = prisma.stock.delete({
            where: {
                product_id: productId,
            },
        });

        await prisma.$transaction([deleteStock, deleteProduct]);
        return formatJSONResponse({ status: `The product ${productId} has been successfully deleted` }, 200);
    } catch (error) {
        return formatErrorJSONResponse(error, 500);
    } finally {
        prisma.$disconnect();
    }
}

export const main = middyfy(deleteProduct);

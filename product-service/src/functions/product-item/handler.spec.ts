import { main, ProductItemEvent } from '@functions/product-item/handler';

import { Product } from '.prisma/client';

import { prismaMock } from '../../prisma/client.mock';
import { PRODUCTS_LIST } from '../../core/products';
import { MOCK_CONTEXT } from '../../core/testing';

it('should return the correct product by an existing id', async () => {
    const productId = '7567ec4b-b10c-48c5-9345-fc73c48a80a0';
    const event: ProductItemEvent = {
        pathParameters: { productId },
    };
    const { title, description, price, count } = PRODUCTS_LIST[0];
    const resolvedProduct:  Product & { stocks: { count: number } } = {
        id: productId,
        title,
        description,
        price,
        stocks: {
            count,
        },
    };
    const response: { body: string, statusCode: number } = await main(event, MOCK_CONTEXT, null!);

    prismaMock.product.findUnique.mockResolvedValue(resolvedProduct);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).product).toStrictEqual(resolvedProduct);
});

it('should return 404 for a non-existing id', async () => {
    const productId = '7567ec4c-b10c-48c5-9345-fc78c48a80a1';
    const event: ProductItemEvent = {
        pathParameters: { productId },
    };
    const response: { body: string, statusCode: number } = await main(event, MOCK_CONTEXT, null!);

    expect(response.statusCode).toBe(404);
});

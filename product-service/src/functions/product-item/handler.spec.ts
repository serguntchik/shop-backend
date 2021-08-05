import { prismaMock } from '../../prisma/client.mock';

import { main } from '@functions/product-item/handler';

import { Product } from '.prisma/client';

import { PRODUCTS_LIST } from '../../core/products';
import { MOCK_CONTEXT } from '../../core/testing';

it('should return the correct product by an existing id', async () => {
    const productId = '7567ec4b-b10c-48c5-9345-fc73c48a80a0';
    const event = {
        pathParameters: { productId },
    };
    const product = { id: productId, ...PRODUCTS_LIST[0] }
    const { id, title, description, price, count } = product;

    const resolvedProduct: Product & { stocks: { count: number } } = {
        id,
        title,
        description,
        price,
        stocks: {
            count,
        },
    };
    prismaMock.product.findUnique.mockResolvedValue(resolvedProduct);

    const response: { body: string, statusCode: number } = await main(event, MOCK_CONTEXT, null!);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).product).toStrictEqual(product);
});

it('should return 404 for a non-existing id', async () => {
    const productId = '7567ec4b-b10c-48c5-9345-fc73c48a80a0';
    const event = {
        pathParameters: { productId },
    };

    prismaMock.product.findUnique.mockResolvedValue(null);
    const response: { body: string, statusCode: number } = await main(event, MOCK_CONTEXT, null!);

    expect(response.statusCode).toBe(404);
});

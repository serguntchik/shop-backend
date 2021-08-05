import { prismaMock } from '../../prisma/client.mock';

import { main } from '@functions/products-list/handler';

import { Product } from '.prisma/client';

import { PRODUCTS_LIST } from '../../core/products';
import { MOCK_CONTEXT } from '../../core/testing';

it('should return the correct list of products', async () => {
    const responseProducts = PRODUCTS_LIST.map((product) => ({ id: '', ...product }));
    const dbProducts: Array<Product & { stocks: { count: number } }> = responseProducts.map((product) => ({
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        stocks: {
            count: product.count,
        },
    }));

    prismaMock.product.findMany.mockResolvedValue(dbProducts);
    const response: { body: string, statusCode: number } = await main({}, MOCK_CONTEXT, null!);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).products).toStrictEqual(responseProducts);
});

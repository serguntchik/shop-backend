import { prismaMock } from '../../prisma/client.mock';

import { main } from '@functions/product-create/handler';

import { Product } from '.prisma/client';

import { ProductResponse } from "../../core/product.interface";
import { MOCK_CONTEXT } from '../../core/testing';

it('should create a new product', async () => {
    const product: ProductResponse = {
        id: '7567ec4b-b10c-48c5-9345-fc73c48a80a0',
        title: "Mazda",
        description: "A splendid Mazda auto",
        price: 154,
        count: 67,
    };
    const resolvedProduct: Product & { stocks: { count: number } } = {
        id: product.id!,
        title: product.title,
        description: product.description,
        price: product.price,
        stocks: {
            count: product.count,
        },
    };
    const event = {
        body: {
            title: product.title,
            description: product.description,
            price: product.price,
            count: product.count,
        },
    };

    prismaMock.product.create.mockResolvedValue(resolvedProduct);
    const response: { body: string, statusCode: number } = await main(event, MOCK_CONTEXT, null!);

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body)).toStrictEqual(product);
});

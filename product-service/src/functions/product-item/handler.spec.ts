import {main, ProductItemEvent} from '@functions/product-item/handler';

import { PRODUCTS_LIST } from '../../core/products';
import { MOCK_CONTEXT } from "../../core/utils";

it('should return the correct product by an existing id', async () => {
    const productId = '7567ec4b-b10c-48c5-9345-fc73c48a80a0';
    const event: ProductItemEvent = {
        pathParameters: { productId },
    };
    const products = await PRODUCTS_LIST;
    const matchingProduct = products.find((product) => product.id === productId);
    const response: { body: string, statusCode: number } = await main(event, MOCK_CONTEXT, null);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).product).toStrictEqual(matchingProduct);
});

it('should return 404 for a non-existing id', async () => {
    const productId = '7567ec4c-b10c-48c5-9345-fc78c48a80a1';
    const event: ProductItemEvent = {
        pathParameters: { productId },
    };
    const response: { body: string, statusCode: number } = await main(event, MOCK_CONTEXT, null);

    expect(response.statusCode).toBe(404);
});

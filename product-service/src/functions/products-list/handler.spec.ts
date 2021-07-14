import { main } from '@functions/products-list/handler';

import { PRODUCTS_LIST } from '../../core/products';
import { MOCK_CONTEXT } from "../../core/utils";

it('should return the correct list of products', async () => {
    const products = await PRODUCTS_LIST;
    const response: { body: string, statusCode: number } = await main({}, MOCK_CONTEXT, null);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).products).toStrictEqual(products);
});

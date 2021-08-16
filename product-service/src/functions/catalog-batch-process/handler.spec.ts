import { prismaMock } from '../../prisma/client.mock';
import { AWS_MOCK } from '../../core/aws.mock';

import { main } from '@functions/catalog-batch-process/handler';

import { MOCK_CONTEXT } from '../../core/testing';

const productsBatch = [
    {
        title: 'Mazda',
        description: 'A splendid Mazda auto',
        price: '154',
        count: '67',
    },
    {
        title: 'Subaru',
        description: "A splendid Subaru auto",
        price: '154',
        count: '67',
    }
];

// @ts-ignore
const createProductSpy = prismaMock.product.create.mockImplementation(({ data }) => Promise.resolve({
    title: data.title,
    description: data.description,
    price: data.price,
    count: data.stocks!.create!.count,
}));

afterEach(() => {
    jest.resetAllMocks();
});

it('should create a new products batch', async () => {
    const event = {
        Records: productsBatch.map((product) => ({ body: JSON.stringify(product) })),
    };
    const createProductSpyArgs = productsBatch.map((product) => ({
        title: product.title,
        description: product.description,
        price: parseInt(product.price),
        stocks: {
            create: {
                count: parseInt(product.count),
            }
        },
    }));

    await main(event, MOCK_CONTEXT, null!);

    const createProductSpyCallArgs = createProductSpy.mock.calls.map((call) => call[0].data);

    expect(createProductSpy).toHaveBeenCalledTimes(productsBatch.length);
    expect(createProductSpyCallArgs).toStrictEqual(createProductSpyArgs);
});

it('should publish the created products to sns', async () => {
    const event = {
        Records: productsBatch.map((product) => ({ body: JSON.stringify(product) })),
    };
    const publishedProducts = productsBatch.map((product) => ({
        title: product.title,
        description: product.description,
        price: parseInt(product.price),
        count: parseInt(product.count),
    }));
    const snsPublishSpy = jest.spyOn(AWS_MOCK.SNS.prototype, 'publish');

    await main(event, MOCK_CONTEXT, null!);

    expect(snsPublishSpy).toHaveBeenCalled();
    expect(snsPublishSpy.mock.calls[0][0].Message).toBe(JSON.stringify(publishedProducts));
});

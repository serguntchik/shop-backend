import { Product } from '@prisma/client';

import { ProductResponse } from './product.interface';

export const createProductResponse: (product: Product, count: number) => ProductResponse = (product: Product, count: number) => {
    return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price!,
        count,
    }
}

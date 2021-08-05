import { PrismaClient } from '@prisma/client';

import { PRODUCTS_LIST } from 'src/core/products';

const prisma = new PrismaClient();

export async function seed() {
    await Promise.all(PRODUCTS_LIST.map((product) => prisma.product.create({
        data: {
            title: product.title,
            description: product.description,
            price: product.price,
            stocks: {
                create: {
                    count: product.count,
                }
            },
        },
    })));
}

seed()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

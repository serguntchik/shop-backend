import { Product } from "./product.interface";

// Imitate the async nature of products, for example when they are taken from the database
export const PRODUCTS_LIST: Promise<Product[]> = Promise.resolve([
    {
        "count": 6,
        "description": "A splendid Subaru auto",
        "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a0",
        "price": 10,
        "title": "Subaru"
    },
    {
        "count": 4,
        "description": "A splendid Volvo auto",
        "id": "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
        "price": 2.4,
        "title": "Volvo"
    },
    {
        "count": 7,
        "description": "A splendid Nissan auto",
        "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a2",
        "price": 23,
        "title": "Nissan"
    },
    {
        "count": 12,
        "description": "A splendid Ferrari auto",
        "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
        "price": 15,
        "title": "Ferrari"
    },
    {
        "count": 7,
        "description": "A splendid Mitsubishi auto",
        "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
        "price": 23,
        "title": "Mitsubishi"
    },
    {
        "count": 8,
        "description": "A splendid Hyundai auto",
        "id": "7567ec4b-b10c-48c5-9345-fc73348a80a1",
        "price": 15,
        "title": "Hyundai"
    },
    {
        "count": 2,
        "description": "A splendid BMW auto",
        "id": "7567ec4b-b10c-48c5-9445-fc73c48a80a2",
        "price": 23,
        "title": "BMW"
    },
    {
        "count": 3,
        "description": "A splendid Mercedes-Benz auto",
        "id": "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
        "price": 15,
        "title": "Mercedes-Benz"
    }
]);

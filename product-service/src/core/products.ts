import { ProductResponse } from "./product.interface";

// Imitate the async nature of products, for example when they are taken from the database
export const PRODUCTS_LIST: ProductResponse[] = [
    {
        "count": 6,
        "description": "A splendid Subaru auto",
        "price": 10,
        "title": "Subaru"
    },
    {
        "count": 4,
        "description": "A splendid Volvo auto",
        "price": 24,
        "title": "Volvo"
    },
    {
        "count": 7,
        "description": "A splendid Nissan auto",
        "price": 23,
        "title": "Nissan"
    },
    {
        "count": 12,
        "description": "A splendid Ferrari auto",
        "price": 15,
        "title": "Ferrari"
    },
    {
        "count": 7,
        "description": "A splendid Mitsubishi auto",
        "price": 23,
        "title": "Mitsubishi"
    },
    {
        "count": 8,
        "description": "A splendid Hyundai auto",
        "price": 15,
        "title": "Hyundai"
    },
    {
        "count": 2,
        "description": "A splendid BMW auto",
        "price": 23,
        "title": "BMW"
    },
    {
        "count": 3,
        "description": "A splendid Mercedes-Benz auto",
        "price": 15,
        "title": "Mercedes-Benz"
    }
];

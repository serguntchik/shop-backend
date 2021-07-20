import { mockDeep, mockReset, MockProxy } from 'jest-mock-extended';

import { PrismaClient } from '@prisma/client';

jest.mock('./client', () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
    mockReset(prismaMock);
})

import prisma from './client';

export const prismaMock = prisma as unknown as MockProxy<PrismaClient>;

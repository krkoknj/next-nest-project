import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
export * from './prisma.module';
export * from './prisma.service';

import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function clearUserTable() {
    try {
        await prisma.users.deleteMany()
    } catch (error) {
        console.error('Error clear data:', error);
    } finally {
        await prisma.$disconnect();
    }
}
if (require.main === module) {
    clearUserTable();
}

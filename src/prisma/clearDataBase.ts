import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearUserTable() {
    try {
        await prisma.users.deleteMany()
        console.log('User table was clear successful');
    } catch (error) {
        console.error('Error clear data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

clearUserTable();
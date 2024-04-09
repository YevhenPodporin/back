import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearUserTable() {
    try {
        await prisma.messages.updateMany({data:{updated_at:null}})
        console.log('updated_at successful');
    } catch (error) {
        console.error('Error clear data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

clearUserTable();
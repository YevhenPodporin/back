import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
    try {
        // Create users
        // await prisma.User.createMany({
        //     data: [
                // { email: 'user1@example.com', name: 'User 1' },
                // { email: 'user2@example.com', name: 'User 2' },
            // ],
        // });

        console.log('Seeding completed successfully');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
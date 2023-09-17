import {PrismaClient} from '@prisma/client';
import {hashSync} from "bcrypt";

const prisma = new PrismaClient();

async function seed() {
    const users = [];
    const usersProfile = [];
    for (let i = 1; i < 20; i++) {
        const userObj = {email: `test${i}@gmail.com`, password: hashSync('123456', 8)}
        const userProfile = {
            first_name: `test${i}`,
            last_name: `testovich${i}`,
            date_of_birth: `2000-05-${i < 10 ? '0' + i : i}`
        }
        usersProfile.push(userProfile)
        users.push(userObj)
    }
    try {
        // Create users

        for (const [index, user] of users.entries()) {
            await prisma.users.create({
                data: {email: user.email, password: user.password, profile: {create: usersProfile[index]}}
            });
        }
        console.log('Seeding completed successfully');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
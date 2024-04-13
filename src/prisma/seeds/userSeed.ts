import {PrismaClient} from '@prisma/client';
import {hashSync} from "bcrypt";

export const prisma = new PrismaClient();

export async function seed() {
    const users = [];

    for (let i = 1; i <= 20; i++) {
        const userObj = {
            email: `test${i}@gmail.com`,
            password: hashSync('123456', 8)
        }
        const profile = {
            first_name: `test${i}`,
            last_name: `testovich${i}`,
            date_of_birth: `2000-05-${i < 10 ? '0' + i : i}`
        }
        users.push({...userObj, profile})
    }

    try {
        // Create users

        for (const [index, user] of users.entries()) {
            await prisma.users.create({
                data: {
                    email: user.email,
                    password: user.password,
                    profile: {create: user.profile}
                }
            });
        }
    } catch (error: any) {
        throw Error('Error by seeding data: ' + error.message )
    } finally {
        await prisma.$disconnect();
    }
}

if (require.main === module) {
   seed();
}
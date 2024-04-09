import {clearUserTable, prisma} from "../../prisma/clearDataBase";
import {seed} from "../../prisma/seeds/userSeed";
import {signAccessToken, verifyAccessToken} from "../../utils/jwt";
import {PrismaClient, Users} from "@prisma/client";

describe('Test accessToken', () => {
    let user: Users;
    let token: string;

    beforeAll(async () => {
        await clearUserTable();
        await seed();
    })

    it('Test signAccessToken', async () => {
        user = await prisma.users.findFirstOrThrow();
        token = await signAccessToken({email: user.email, id: user.id})

        expect(token).toBeTruthy
    })

    it('Test correct verifyAccessToken', async () => {
        const res = await verifyAccessToken(token)

        expect(res.id).toEqual(user.id)
        expect(res.email).toEqual(user.email)
    })

    it('Test incorrect verifyAccessToken', async () => {
        await verifyAccessToken('12312').catch(e=>{
            expect(e).toBeTruthy()
        })
    })

    afterAll(async () => await clearUserTable())
})
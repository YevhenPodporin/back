import {clearUserTable} from "../../prisma/clearDataBase";
import {requestApp, createUserObject} from '../index'
import {verifyAccessToken} from "../../utils/jwt";
import userService from "../../api/servises/user.service";

describe('Testing auth', () => {
    let testUser = createUserObject();

    beforeAll(async () => {
        await clearUserTable();
    })

    it('Register user with correct data', async () => {
        const res = await requestApp.post('/api/auth/register').send(testUser);

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('User created successfully');
        expect(res.body.data.token).toBeTruthy();

        const payload = await verifyAccessToken(res.body.data.token);
        const registeredUser = await userService.findUser({id: payload.id})

        expect(registeredUser).toBeTruthy();
        expect(registeredUser?.email).toEqual(testUser.email)
    })

    it('Register user without email/passowrd', async () => {
        const res = await requestApp.post('/api/auth/register').send({
            date_of_birth: testUser.date_of_birth,
            last_name: testUser.last_name,
            first_name: testUser.first_name,
        });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({
            errors: [
                { label: 'email', message: '"email" is required' },
                { label: 'password', message: '"password" is required' }
            ]
        });
    })

    it('Register user with empty data', async () => {
        const res = await requestApp.post('/api/auth/register').send({});

        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toHaveLength(Object.keys(testUser).length)
    })

    it('Test correct login', async () => {
        const res = await requestApp.post('/api/auth/login').send({
            email: testUser.email,
            password: testUser.password
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Account login successful');
        expect(res.body.accessToken).toBeTruthy();

        const payload = await verifyAccessToken(res.body.accessToken);
        const registeredUser = await userService.findUser({id: payload.id})

        expect(registeredUser).toBeTruthy();
        expect(registeredUser?.email).toEqual(testUser.email)
    })

    afterAll(async () => await clearUserTable())
});
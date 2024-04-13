import supertest from "supertest";
import {app} from "../app";

export const requestApp = supertest(app);

export type userReturn = {
    email: string
    password: string
    first_name: string,
    last_name: string,
    date_of_birth: string
}

export const createUserObject = (): userReturn => {
    return {
        email: `test-user@gmail.com`,
        password: '123456',
        first_name: `test`,
        last_name: `testovich`,
        date_of_birth: `2000-01-01`
    }
}


export const loginTestUser = async (): Promise<{
    message: string,
    accessToken: string
}> => {
    const res = await requestApp.post('/api/auth/login').send({
        email: 'test1@gmail.com',
        password: '123456'
    });

    return res.body
}
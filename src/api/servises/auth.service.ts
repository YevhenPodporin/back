import {UserRegisterRequestBody} from "../../types/UserTypes";

const createError = require('http-errors')

import {PrismaClient, Prisma} from "@prisma/client";
import {Request} from "express";
import {signAccessToken} from "../../utils/jwt";
import {compareSync, hashSync} from "bcrypt";


const prisma = new PrismaClient({errorFormat: "pretty"});


require('dotenv').config();

class authService {
    public hi(number: number) {
        return number * number
    }

    public async register(data: UserRegisterRequestBody) {
        const {email, first_name, last_name, date_of_birth, file} = data;
        const password = hashSync(String(data.password), 8);
        try {
            const user = await prisma.users.create({
                data: {
                    email,
                    password,
                    profile: {
                        create: {
                            first_name,
                            date_of_birth,
                            last_name,
                            file_path: file ? file.filename : null,
                            is_online: true
                        }
                    }
                },
            })
            const token = await signAccessToken(user);
            // await prisma.users.delete({where:{email}})
            return {token};
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                return {error: `User with email ${email} already registered`}
            } else {
                return {error: 'Something wrong'}
            }
        }
    }

    public async login(req: Request) {
        const {email, password} = req.body;
        const user = await prisma.users.findFirst({
            where: {email},
        });
        if (!user) {
            return {error: `User not found`}
        }
        try {
            if (user.password) {
                const checkPassword = compareSync(password, user.password)

                if (!checkPassword) throw createError.Unauthorized('Email address or password not valid')
                const accessToken = await signAccessToken({email, id: user.id});
                return {accessToken}
            }
        } catch (error) {
            return {error: error || `Access token expired`}
        }
    }

    public async googleLoginOrRegister(data: UserRegisterRequestBody) {
        const maybeUser = await prisma.users.findFirst({
            where: {
                google_id: data.google_id
            }
        })

        if (!maybeUser) {
            await prisma.users.create({
                data: {
                    email: data.email,
                    google_id: data.google_id,
                    profile: {
                        create: {
                            first_name: data.first_name,
                            last_name: data.last_name,
                            is_online: true
                        }
                    }
                }
            })
        }
    }
}

export default new authService();
import {UserRegisterRequestBody} from "../../models/UserModel";

const createError = require('http-errors')

import {PrismaClient, Prisma, RequestStatus} from "@prisma/client";
import {Request} from "express";


const prisma = new PrismaClient({errorFormat: "pretty"});
const bcrypt = require('bcrypt')
const jwt = require('../../../utils/jwt.js');
require('dotenv').config();

class authService {
    static async register(data: UserRegisterRequestBody) {
        const {email, first_name, last_name, date_of_birth, file} = data;
        const password = bcrypt.hashSync(data.password, 8);

        try {
            await prisma.users.create({
                data: {
                    email,
                    password,
                    profile: {
                        create: {
                            first_name,
                            date_of_birth,
                            last_name,
                            // file_path: file?.path.replace('storage\\',''),
                            file_path: file?.path,
                            is_online: true
                        }
                    }
                },
            });
            const token = await jwt.signAccessToken(data);
            return {token};
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                return {error: `User with email:${email} already registered`}
            }
        }
    }

    static async login(req: Request) {
        const {email, password} = req.body;
        const token = req.headers.token
        const user = await prisma.users.findFirst({
            where: {
                email
            },
        });
        if (!user) {
            return {error: `User not found`}
        }
        try {
            const checkPassword = bcrypt.compareSync(password, user.password)

            if (!checkPassword) throw createError.Unauthorized('Email address or password not valid')
            const accessToken = await jwt.signAccessToken(req.body);
            return {status: 'OK', accessToken}
        } catch (error) {

            return {error: error ? error : `Access token expired`}
        }

    }


}

export default authService;
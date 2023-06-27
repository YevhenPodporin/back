"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const createError = require('http-errors');
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({ errorFormat: "pretty" });
const bcrypt = require('bcrypt');
const jwt = require('../../../utils/jwt.js');
require('dotenv').config();
class authService {
    static register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, first_name, last_name, date_of_birth, file } = data;
            const password = bcrypt.hashSync(data.password, 8);
            // const formatedDateOfBirth = dayjs(date_of_birth).add(1,'day').toDate()
            try {
                let user = yield prisma.users.create({
                    data: {
                        email,
                        password,
                        profile: {
                            create: {
                                first_name,
                                date_of_birth: date_of_birth,
                                last_name,
                                file_path: null,
                                is_online: true
                            }
                        }
                    },
                });
                const token = yield jwt.signAccessToken(data);
                return { token };
            }
            catch (e) {
                if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                    return { error: `User with email:${email} already registered` };
                }
            }
        });
    }
    static login(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const token = req.headers.token;
            const user = yield prisma.users.findFirst({
                where: {
                    email
                },
            });
            if (!user) {
                return { error: `User not found` };
            }
            try {
                const checkPassword = bcrypt.compareSync(password, user.password);
                if (!checkPassword)
                    throw createError.Unauthorized('Email address or password not valid');
                const accessToken = yield jwt.signAccessToken(req.body);
                return { status: 'OK', accessToken };
            }
            catch (error) {
                return { error: `Access token expired` };
            }
        });
    }
}
exports.default = authService;

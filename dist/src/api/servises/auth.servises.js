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
const prisma = new client_1.PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('../../../utils/jwt.js');
require('dotenv').config();
class AuthService {
    static register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = data;
                data.password = bcrypt.hashSync(data.password, 8);
                let user = yield prisma.users.create({ data });
                if (user) {
                    data.accessToken = yield jwt.signAccessToken(user);
                    return Object.assign({}, data);
                }
            }
            catch (e) {
                console.log(e, 'oleg');
                throw createError(404, e);
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
                }
            });
            if (!user) {
                throw createError.statusCode(204).NotFound('User not registered');
            }
            try {
                const checkPassword = bcrypt.compareSync(password, user.password);
                if (!checkPassword)
                    throw createError.Unauthorized('Email address or password not valid');
                const accessToken = yield jwt.verifyAccessToken(token);
                return Object.assign(Object.assign({}, user), { accessToken });
            }
            catch (error) {
                return error;
            }
        });
    }
    static all() {
        return __awaiter(this, void 0, void 0, function* () {
            const allUsers = yield prisma.users.findMany();
            return allUsers;
        });
    }
}
exports.default = AuthService;

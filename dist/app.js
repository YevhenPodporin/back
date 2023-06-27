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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const compression_1 = __importDefault(require("compression"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
(() => __awaiter(void 0, void 0, void 0, function* () {
    // const add = await prisma.user.create({
    //     data:{
    //         name:'OLEG',
    //         email:'test923@mail.ru',
    //         posts:{
    //             createMany:{
    //                 data:[
    //                     {
    //                         content:"oleg loshara",
    //                         title:"title pobeda",
    //                     },
    //                     {
    //                         content:"oleg oleg",
    //                         title:"Olegovich",
    //                     }
    //                 ]
    //
    //             },
    //         }
    //     }
    // })
    const getUser = yield prisma.user.findFirst({ include: { posts: true } });
    console.log(getUser);
}))();
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

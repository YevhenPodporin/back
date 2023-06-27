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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const auth_servise_1 = __importDefault(require("../servises/auth.servise"));
const express_validator_1 = require("express-validator");
const createError = require('http-errors');
const multer = require('multer');
const upload = multer({ dest: 'storage/files' });
class authController {
}
_a = authController;
authController.register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errorValidation = (0, express_validator_1.validationResult)(req);
    const data = yield auth_servise_1.default.register(Object.assign(Object.assign({}, req.body), { file: req.files }));
    if (data === null || data === void 0 ? void 0 : data.error) {
        res.status(404).json({
            error: data.error,
            data: {}
        });
    }
    else {
        res.status(200).json({
            message: 'User created successfully',
            data
        });
    }
});
authController.login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield auth_servise_1.default.login(req);
    if (data === null || data === void 0 ? void 0 : data.error) {
        res.status(404).json({
            error: data.error,
            data: {}
        });
    }
    else {
        res.status(200).json({
            status: true,
            message: "Account login successful",
            data
        });
    }
});
exports.default = authController;

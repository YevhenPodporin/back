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
const express_1 = require("express");
// import auth from '../../../middlewares/auth';
const createError = require('http-errors');
const router = (0, express_1.Router)();
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth = require('../../../middlewares/auth.js');
const express_validator_1 = require("express-validator");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
router.post('/register', [
    (0, express_validator_1.check)(['email', 'name'], 'Email, name are required').notEmpty(),
    (0, express_validator_1.check)('password', 'Password is required').notEmpty(),
], auth_controller_1.default.register);
router.post('/login', auth_controller_1.default.login);
router.get('/profile', auth, user_controller_1.default.getProfile);
// router.use(/^\/(?!register|login).*$/,auth);
router.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    next(createError.NotFound('Page not found'));
}));
router.use((err, req, res, next) => {
    res.status(500).json({
        status: 500,
        message: err
    });
});
exports.default = router;

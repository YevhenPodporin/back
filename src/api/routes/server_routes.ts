import {
    NextFunction,
    Router,
    Request,
    Response,
    Errback
} from "express";
// import auth from '../../../middlewares/auth';
const createError = require('http-errors')
const router = Router();
import authController from "../controllers/auth.controller";
const auth = require('../../../middlewares/auth.js');
import { check } from 'express-validator';
import userController from "../controllers/user.controller";
const fileMiddleware = require('../../../middlewares/storageUpload')


router.post('/register',[
    check(['email','first_name','password'], (value, meta)=>`${meta.path} is required`).notEmpty(),
], authController.register);

router.post('/login',[
    check(['email','password'], 'Email, password are required').notEmpty(),
], authController.login);

router.get('/profile',auth, userController.getProfile);


// router.use(/^\/(?!register|login).*$/,auth);

router.use(async (req, res, next) => {
    next(createError.NotFound('Page not found'))
})
router.use((err:Errback, req: Request, res: Response, next: NextFunction) => {
    res.status( 500).json({
        status: 500,
        message: err
    })
})

export default router;
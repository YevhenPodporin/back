import {
    NextFunction,
    Router,
    Request,
    Response,
    Errback
} from "express";
import {isHttpError, } from "http-errors";

const router = Router();
import authController from "../controllers/auth.controller";


import userController from "../controllers/user.controller";
import withUploadFile from '../../middlewares/storageUpload';
import sendFile from "../../middlewares/sendFile";
import {auth} from "../../middlewares/auth";
import uploadFileMiddleware from '../../middlewares/storageUpload';

// router.use(/^\/(?!register|login).*$/, auth);

router.post('/register',uploadFileMiddleware, authController.register);

router.post('/login', authController.login);

router.get('/profile', userController.getProfile);
router.post('/profile/edit', userController.editProfile);

router.get('/image/:file_name', sendFile)


export default router;
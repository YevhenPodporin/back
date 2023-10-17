import {
    Router,
} from "express";

const router = Router({mergeParams: true});
import {auth} from "../../middlewares/auth";
import uploadFileMiddleware from '../../middlewares/storageUpload';

import authController from "../controllers/auth.controller";
import networkController from "../controllers/network.controller";
import userController from "../controllers/user.controller";
import chatController from "../controllers/chat.controller";


router.use(/^\/(?!register|login).*$/, auth);

/*Authorization roots*/
router.post('/register', uploadFileMiddleware, authController.register);
router.post('/login', authController.login);
router.post('/sign_out', authController.signOut);

/*User profile roots*/
router.get('/profile', userController.getProfile);
router.post('/profile/edit', uploadFileMiddleware, userController.editProfile);

/*Network roots*/
router.get('/network/get_users', networkController.getUsersList);
router.post('/network/request', networkController.userRequest);

router.post('/chat/create', chatController.createChat);
router.get('/chat/list', chatController.getChatList);
router.get('/chat/get_chat_info', chatController.getChat);
router.get('/chat/messages', chatController.getMessages);
// router.get('/image/:file_name', sendFile)
export default router;
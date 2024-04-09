import {Router} from "express";
import chatController from "../controllers/chat.controller";

const chatRouter = Router();
chatRouter.post('/create', chatController.createChat);
chatRouter.get('/list', chatController.getChatList);
chatRouter.get('/get_chat_info', chatController.getChat);
chatRouter.get('/messages', chatController.getMessages);

export default chatRouter;
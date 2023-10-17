import {NextFunction, Request, Response} from 'express';
import chatService from "../servises/chat.service";
import {CreateChatType, GetMessages} from "../../types/ChatTypes";
import {createChatValidate} from "../../validation/userValidation";

class chatController {
    public createChat = async (req: Request, res: Response, next: NextFunction) => {
        const body: CreateChatType = {
            from_user_id: res.locals.user.id.toString(),
            to_user_id: req.body.to_user_id.toString()
        }
        const error = createChatValidate(body)
        if (error?.errors) {
            return res.status(404).json(error)
        }

        const data = await chatService.createChat(body);

        if (data?.error) {
            res.status(404).json({
                error: data.error,
            })
        } else {
            res.status(200).json(data)
        }
        return next()
    }

    public async getChatList(req: Request, res: Response) {
        const user_id = res.locals.user.id
        const data = await chatService.getChatList(user_id)
        res.status(200).json(data)
    }

    public async getChat(req: Request, res: Response) {
        if (req.query.id) {
            // const data = await chatService.getRoom(+req.query.id)
            // return  res.status(200).json(data)
        }
        res.status(400).json({error: 'Chat id required'})
    }

    public async getMessages(req: Request & {query:GetMessages}, res: Response) {
        const params: GetMessages = {...req.query, user:res.locals.user}
        const data = await chatService.getMessagesInChat(params)
        return res.status(200).json(data)
    }

}

export default new chatController();
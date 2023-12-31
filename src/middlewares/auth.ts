import {NextFunction, Request, Response} from "express";
import {verifyAccessToken} from "../utils/jwt";
import userService from "../api/servises/user.servise";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        console.log(1)
       return  res.status(401).end();
    }
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        console.log(2)
        return res.status(401);
    }

    verifyAccessToken(token).then(async (user) => {
        res.locals.user = user;
        // @ts-ignore
        await userService.setStatusIsOnline({user_id: user.id, is_online: true})
        next();
    }).catch(e => {
        return res.status(401).json(e);
    })

}



import {NextFunction, Request, Response} from "express";
import {verifyAccessToken} from "../utils/jwt";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return  res.status(401).end();
    }

    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401);
    }
    verifyAccessToken(token).then((user) => {
        res.locals.user = user;
        next();
    }).catch(e => {
        res.status(401).json(e);
    })
}

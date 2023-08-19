import {NextFunction, Request, Response} from "express";


import {verifyAccessToken} from "../utils/jwt";
import createHttpError from "http-errors";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return next(createHttpError.Unauthorized('Access token is required'))
    }

    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
        return next(createHttpError.Unauthorized())
    }
    try {
        const user = verifyAccessToken(token)
        req.body.payload = user
        next()
    } catch (e: any) {
        res.status(401).json(e)
    }

}

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {JwtPayload} from "../types/UserTypes";

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "";

export function signAccessToken(payload:JwtPayload) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            accessTokenSecret,
            {expiresIn: "1d"},
            (err: any, token: any) => {
                if (err) {
                    reject(err.message)
                    throw new Error(err.message)
                } else {
                    resolve(token)
                }
            },
        )
    })
}

export function verifyAccessToken(token: string) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, accessTokenSecret, (err, payload) => {
            if (err) {
                const message = err.name == 'JsonWebTokenError' ? 'Unauthorized' : err.message
                reject(message)
            }
            resolve(payload)
        })
    })
}

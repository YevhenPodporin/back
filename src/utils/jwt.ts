import  jwt, {Secret,JwtPayload} from "jsonwebtoken";
import * as createHttpError from "http-errors";
import dotenv from "dotenv";
dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "";

  export function signAccessToken(payload:any){
         return jwt.sign(
                { payload},
                accessTokenSecret ,
                {expiresIn: "1d"},
                (err:any, token:any) => {
                    throw new Error(err.message)
    })}

   export function verifyAccessToken(token:string):void{
          return jwt.verify(token, accessTokenSecret, (err:any, payload:any) => {
                if (err) {
                    const message = err.name == 'JsonWebTokenError' ? 'Unauthorized' : err.message
                 throw new createHttpError.Unauthorized(message)
                }
                return payload
            })
    }

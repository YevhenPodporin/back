import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {JwtPayload} from "../types/UserTypes";
import {OAuth2Client} from "google-auth-library";
import UserService from "../api/servises/user.service";

dotenv.config();

const accessTokenSecret = String(process.env.GOOGLE_CLIENT_SECRET);

export function signAccessToken(payload: JwtPayload) {
    return new Promise<string>((resolve, reject) => {
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

export function verifyAccessToken(token: string): Promise<JwtPayload> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, accessTokenSecret, async (err, payload) => {
            if (err) {
                const {payload,google_id} = await verifyGoogleToken(token);
                if(payload?.email && google_id){
                    const user = await UserService.findUser({google_id});
                    if(user){
                        resolve ({email:payload.email, id:user.id})
                    }else{
                        reject('User not found');
                    }
                }else{
                    const message = err.name == 'JsonWebTokenError' ? 'Unauthorized' : err.message;
                    reject(message);
                }
            }

            resolve(payload as JwtPayload);
        })
    })
}

export  async function verifyGoogleToken(token:string){
    try{
        const client = new OAuth2Client(String(process.env.GOOGLE_CLIENT_ID));
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: String(process.env.GOOGLE_CLIENT_ID)
        })
        const payload = ticket.getPayload();
        const google_id = ticket.getUserId();
        return {payload, google_id};
    }catch (e){
        return {payload:null,google_id:null}
    }
}

import {NextFunction, Request, Response} from 'express';
import AuthServises from "../servises/auth.service";
import {UserRegisterWithoutFile} from "../../types/UserTypes";
import {useLoginValidate} from "../../validation/userValidation";
import UserService from "../servises/user.service";
import {OAuth2Client} from "google-auth-library";
import {verifyGoogleToken} from "../../utils/jwt";
import { Mail } from "../../mailer/nodemailer";


class authController {
    public register = async (req: Request, res: Response) => {
        const body: UserRegisterWithoutFile = req.body
        const data = await AuthServises.register({...body, file: req?.file});
        if (data.error) {
            res.status(404).json(data)
        } else {
            res.status(200).json({
                message: 'User created successfully',
                data
            })
        }
    }
    public login = async (req: Request, res: Response) => {
        Mail.sendMail({to: 'usermeen@gmail.com', html: '<h1>OLEGGGGGGGGG</h1>'})
        const errors = useLoginValidate(req.body);
        if (errors) {
            res.status(400).json({
                errors,
                name: 'validation_error'
            })
        } else {
            const data = await AuthServises.login(req);
            if (data?.error) {
                res.status(404).json({
                    error:data.error
                })
            } else {
             return res.status(200).json({
                    message: "Account login successful",
                    accessToken:data?.accessToken
                })
            }
        }
    }

    public async googleAuth (req: Request, res: Response, next: NextFunction) {
        const token = req.body.token;
        const {google_id,payload} = await verifyGoogleToken(token);
        if(payload && google_id){
            try{
                await  AuthServises.googleLoginOrRegister({
                    google_id:google_id,
                    email:String(payload.email),
                    first_name:String(payload.given_name),
                    last_name:String(payload.family_name),
                    file:undefined,
                    password:null,
                    date_of_birth:null
                })

                res.json({accessToken:token})
            }catch (e){
                res.status(400).json({error: 'Login invalid'})
            }

        }
    }


    public async signOut(req: Request, res: Response) {
        await UserService.setStatusIsOnline({user_id: res.locals.user.id, is_online: false})
        res.status(200).json({
            message: "Account logout successful",
        })
    }
}

export default new authController();
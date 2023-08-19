import {NextFunction, Request, Response} from 'express';
import AuthServises from "../servises/auth.servise";
import {UserRegisterRequestBody} from "../../models/UserModel";

const createError = require('http-errors');

class authController {
    static register = async (req: Request, res: Response, next: NextFunction) => {
        console.log('ЗАШЕЛ')
        return;
        const body:UserRegisterRequestBody = req.body
        const data = await AuthServises.register({...body, file: req.file});
        if (data.error) {
             res.status(404).json(data)
        } else {
             res.status(200).json({
                message: 'User created successfully',
                data
            })
        }
    }
    static login = async (req: Request, res: Response, next: NextFunction) => {
        const data = await AuthServises.login(req);
        if (data?.error) {
            res.status(404).json({
                error: data.error,
                data: {}
            })
        } else {
            res.status(200).json({
                status: true,
                message: "Account login successful",
                data
            })
        }

    }

}

export default authController;